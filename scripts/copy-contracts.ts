import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'
import fs from 'fs-extra'
import { config } from 'dotenv'
import { select } from '@inquirer/prompts'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const CONTRACTS = [
  'TradingManager',
  'PropertyManager',
  'PropertyToken',
  'SimpleERC20',
  'RealEstateFacade',
  'RewardManager'
]

const ADDRESS_MAP = {
  'TradingManager': 'CONTRACT_TRADINGMANAGER_ADDRESS',
  'PropertyManager': 'CONTRACT_PROPERTYMANAGER_ADDRESS',
  'PropertyToken': 'CONTRACT_PROPERTYTOKEN_ADDRESS',
  'SimpleERC20': 'CONTRACT_TESTTOKEN_ADDRESS',
  'RealEstateFacade': 'CONTRACT_REALESTATEFACADE_ADDRESS',
  'RewardManager': 'CONTRACT_REWARDMANAGER_ADDRESS'
}

const [, , root] = process.argv

if (!root) {
  console.error('请提供合约项目的路径')
  process.exit(1)
}

const rootPath = resolve(root)
const mode = await select({
  message: '请选择合约 ABI 生成模式',
  choices: [
    { name: '开发模式', value: 'dev' },
    { name: '生产模式', value: 'prod' }
  ]
})

const targetPath = r(`../src/contract/${mode}`)

config({
  path: resolve(rootPath, '.env.example')
})

const contractsPath = resolve(rootPath, 'artifacts', 'contracts')

if (!fs.existsSync(contractsPath)) {
  console.error('合约项目路径不正确，未找到 artifacts 目录')
  process.exit(1)
}

const contractList = CONTRACTS.map((contractName) => {
  const filePath = resolve(contractsPath, `${contractName}.sol`, `${contractName}.json`)

  try {
    const content = fs.readJsonSync(filePath)
    return {
      name: contractName,
      address: process.env[ADDRESS_MAP[contractName as keyof typeof ADDRESS_MAP]],
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
  fs.ensureDirSync(targetPath)
  fs.writeJsonSync(abiFilePath, {
    abi: contract.abi,
    address: contract.address
  }, { spaces: 2 })
  console.log(`已生成合约 ${contract.name} 的 ABI 文件: ${abiFilePath}`)
})

// 生成 index.ts 文件
const indexContent = `
// 此文件由脚本自动生成
const devModules = import.meta.glob('./dev/*.json', { eager: true })
const prodModules = import.meta.glob('./prod/*.json', { eager: true })

/**
 * 获取合约 ABI 和地址
 * @param contractName 合约文件名（如 PropertyToken）
 */
export function getContracts(contractName: string) {
  const mode = import.meta.env.MODE === 'production' ? 'prod' : 'dev'
  const modules = mode === 'prod' ? prodModules : devModules
  const fileKey = \`./\${mode}/\${contractName}.json\`
  const mod = modules[fileKey] as Record<string, any>
  if (!mod) {
    console.error(\`未找到合约 \${contractName} 的 ABI 文件\`)
    return null
  }
  // Vite eager glob 导入的 json 结构
  return mod.default || mod
}
`.trimStart()

const indexFilePath = resolve(r('../src/contract'), 'index.ts')
fs.ensureDirSync(r('../src/contract'))
fs.writeFileSync(indexFilePath, indexContent)
console.log(`已生成 index.ts 文件: ${indexFilePath}`)
