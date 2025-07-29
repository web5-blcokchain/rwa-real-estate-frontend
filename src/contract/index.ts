// 此文件由脚本自动生成
// const devModules = import.meta.glob('./dev/*.json', { eager: true })
const prodModules = import.meta.glob('./prod/*.json', { eager: true })
const devTestModules = import.meta.glob('./dev/*.json', { eager: true })

/**
 * 获取合约 ABI 和地址
 * @param contractName 合约文件名（如 PropertyToken）
 */
export function getContracts(contractName: string) {
  const mode = import.meta.env.MODE === 'production' ? 'prod' : 'dev'
  const modules = mode === 'prod' ? prodModules : devTestModules
  const fileKey = `./${mode}/${contractName}.json`
  const mod = modules[fileKey] as Record<string, any>
  if (!mod) {
    console.error(`未找到合约 ${contractName} 的 ABI 文件`)
    return null
  }
  // Vite eager glob 导入的 json 结构
  return mod.default || mod
}
