import process from "process"
import { resolve } from 'pathe'
import fs from 'fs-extra'
import { config } from 'dotenv'
import { fileURLToPath } from "url"

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const CONTRACTS = [
  'TradingManager',
  'PropertyManager',
  'PropertyToken',
  'SimpleERC20',
  'RealEstateFacade'
]

const ADDRESS_MAP = {
  'TradingManager': 'CONTRACT_TRADINGMANAGER_ADDRESS',
  'PropertyManager': 'CONTRACT_PROPERTYMANAGER_ADDRESS',
  'PropertyToken': 'CONTRACT_PROPERTYTOKEN_ADDRESS',
  'SimpleERC20': 'CONTRACT_TESTTOKEN_ADDRESS',
  'RealEstateFacade': 'CONTRACT_REALESTATEFACADE_ADDRESS'
}

const needContractAddress = [
  'PropertyToken'
]

const [, , root] = process.argv

if (!root) {
  console.error('请提供合约项目的路径')
  process.exit(1)
}

const rootPath = resolve(root)
const targetPath = r('../src/contract')

config({
  path: resolve(rootPath, '.env.example')
})

const contractsPath = resolve(rootPath, 'artifacts', 'contracts')

if (!fs.existsSync(contractsPath)) {
  console.error('合约项目路径不正确，未找到 artifacts 目录')
  process.exit(1)
}

const contractList = CONTRACTS.map(contractName => {
  const filePath = resolve(contractsPath, `${contractName}.sol`, `${contractName}.json`)

  try {
    const content = fs.readJsonSync(filePath)
    return {
      name: contractName,
      address: process.env[ADDRESS_MAP[contractName]],
      abi: content.abi
    }
  } catch (error) {
    console.error(`合约 ${contractName} 未找到`)
    process.exit(1)
  }
})

// 确保目标目录存在
fs.ensureDirSync(targetPath)

// 生成 ABI JSON 文件
contractList.forEach(contract => {
  const abiFilePath = resolve(targetPath, `${contract.name}.json`)
  fs.writeJsonSync(abiFilePath, {
    abi: contract.abi,
    address: contract.address
  }, { spaces: 2 })
  console.log(`已生成合约 ${contract.name} 的 ABI 文件: ${abiFilePath}`)
})

// 生成 index.ts 文件
const indexContent = `import { getWeb3Instance } from '@/utils/web3'
${contractList.map(contract => `import ${contract.name} from './${contract.name}.json'`).join('\n')}

${contractList.map(contract => {
  // 如果合约需要动态地址
  if (needContractAddress.includes(contract.name)) {
    return `
/**
 * 获取 ${contract.name} 合约实例
 * @param contractAddress ${contract.name} 合约地址，每个房产都有自己的 ${contract.name} 合约
 * @returns ${contract.name} 合约实例
 */
export function use${contract.name}Contract(contractAddress?: string) {
  if (!contractAddress) return null

  try {
    const web3 = getWeb3Instance()
    const contract = new web3.eth.Contract(
      ${contract.name}.abi,
      contractAddress
    )

    return contract
  } catch (error) {
    console.error('Failed to get ${contract.name} contract:', error)
    return null
  }
}`
  } 
  // 常规合约使用固定地址
  else {
    return `
/**
 * 获取 ${contract.name} 合约实例
 * @returns ${contract.name} 合约实例
 */
export function use${contract.name}Contract() {
  const web3 = getWeb3Instance()
  const contract = new web3.eth.Contract(
    ${contract.name}.abi,
    '${contract.address}'
  )

  return contract
}`
  }
}).join('\n')}
`

const indexFilePath = resolve(targetPath, 'index.ts')
fs.writeFileSync(indexFilePath, indexContent)
console.log(`已生成 index.ts 文件: ${indexFilePath}`)
