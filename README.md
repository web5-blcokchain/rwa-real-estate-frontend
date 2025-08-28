# Real Estate RWA Frontend

日本不动产 RWA（Real World Assets）前端项目 - 基于区块链技术的不动产代币化平台

## 📋 项目概述

本项目是一个面向日本不动产市场的 RWA 前端应用，通过区块链技术实现不动产资产的代币化，为投资者提供便捷的数字化投资体验。

### 核心功能
- 不动产资产展示与投资
- 用户资产管理和交易记录
- 多语言支持（中文、英文、日文）
- 钱包集成与区块链交互
- 代币购买、赎回、转让等交易流程

## 🛠 技术栈

- **框架**: React 19 + Vite 6
- **状态管理**: Zustand 5
- **路由**: TanStack Router 1.114
- **数据请求**: React Query 5 + Axios
- **区块链**: Ethers 6 + Viem 2 + Web3 4
- **钱包**: Privy Auth SDK
- **样式**: Tailwind CSS + UnoCSS + SCSS
- **国际化**: i18next + react-i18next
- **构建工具**: PNPM + TypeScript 5.8 + ESLint 9

## 📋 系统要求

- **Node.js**: >= 18.x
- **PNPM**: >= 10.x
- **Git**: 用于版本控制
- **操作系统**: macOS, Linux, Windows

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd rwa-real-estate-frontend
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

创建环境变量文件：

```bash
# 复制环境变量模板
cp .env.example .env.local
```

配置以下环境变量：

```env
# API 配置
VITE_PUBLIC_API_URL=https://your-api-server.com/api

# Privy 认证配置
VITE_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# Web3 区块链配置
VITE_PUBLIC_WEB3_RPC_URL=https://your-rpc-endpoint
VITE_PUBLIC_WEB3_CHAIN_ID=1
VITE_PUBLIC_WEB_BLOCK_URL=https://etherscan.io

# 链信息配置
VITE_APP_CHAIN_NAME=Ethereum
VITE_APP_CHAIN_COIN_NAME=Ethereum
VITE_APP_CHAIN_COIN_SYMBOL=ETH
VITE_APP_CHAIN_COIN_DECIMALS=18

# 合约地址配置
VITE_APP_USDC_ADDRESS=0x...
VITE_PUBLIC_RENT_CUSTODY_CONTRACT_ADDRESS=0x...
VITE_PUBLIC_REDEMPTION_MANAGER_ADDRESS=0x...
VITE_PUBLIC_TREASURY_ADDRESS=0x...
VITE_PUBLIC_TRADE_CONTRACT_ADDRESS=0x...
VITE_APP_PAY_TOKEN_NAME=USDC
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

## 🏗 构建与部署

### 开发环境构建

```bash
# 开发环境构建（基于 preview 分支）
pnpm build
```

### 生产环境构建

```bash
# 生产环境构建（基于 main/master 分支）
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

访问 [http://localhost:4173](http://localhost:4173) 预览生产构建。

## 📦 部署指南

### 方案一：SFTP 部署（当前）

项目配置了基于 SFTP 的自动部署脚本：

#### 1. 配置 SSH 密钥

```bash
# 生成 SSH 密钥对（如果没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 将公钥添加到服务器
ssh-copy-id user@your-server.com
```

#### 2. 修改部署配置

编辑 `scripts/deploy.ts`：

```typescript
const sftpUploaderConfig = {
  localDir: 'dist',
  remoteDir: '/www/wwwroot/your-domain.com',
  connect: {
    host: 'your-server-ip',
    port: 22,
    username: 'your-username',
    privateKey: fs.readFileSync(`${homedir()}/.ssh/id_rsa`)
  }
}
```

#### 3. 执行部署

```bash
# 构建并部署
pnpm build
esno scripts/deploy.ts
```

### 方案二：Vercel 部署（推荐）

#### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2. 部署到 Vercel

```bash
# 首次部署
vercel

# 生产环境部署
vercel --prod
```

#### 3. 环境变量配置

在 Vercel 控制台中配置环境变量，或使用 CLI：

```bash
vercel env add VITE_PUBLIC_API_URL
vercel env add VITE_PUBLIC_PRIVY_APP_ID
# ... 其他环境变量
```

### 方案三：Netlify 部署

#### 1. 创建 `netlify.toml`

```toml
[build]
  publish = "dist"
  command = "pnpm build"

[build.environment]
  NODE_VERSION = "18"
  PNPM_VERSION = "10.6.2"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. 连接 Git 仓库

在 Netlify 控制台连接 GitHub/GitLab 仓库，配置环境变量。

### 方案四：AWS S3 + CloudFront

#### 1. 安装 AWS CLI

```bash
aws configure
```

#### 2. 创建部署脚本

```bash
#!/bin/bash
# deploy-aws.sh

# 构建项目
pnpm build

# 上传到 S3
aws s3 sync dist/ s3://your-bucket-name --delete

# 清除 CloudFront 缓存
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 智能合约集成

### 合约 ABI 更新

当智能合约更新时，需要同步 ABI 文件：

```bash
# 从合约项目复制 ABI
pnpm copy-contracts /path/to/contract-project
```

脚本会提示选择环境（开发/生产）并自动生成相应的 ABI 文件到 `src/contract/` 目录。

### 支持的合约

- **PropertyToken**: 不动产代币合约
- **RedemptionManager**: 赎回管理合约
- **TradeContract**: 交易合约
- **Treasury**: 资金库合约
- **SimpleERC20**: USDC 代币合约

## 🌍 环境配置说明

### 开发环境 vs 生产环境

- **开发环境**: `preview` 分支触发，使用 `development` 模式
- **生产环境**: 其他分支触发，使用 `production` 模式

### 必需环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_PUBLIC_API_URL` | 后端 API 地址 | `https://api.example.com` |
| `VITE_PUBLIC_PRIVY_APP_ID` | Privy 应用 ID | `clxxxxx` |
| `VITE_PUBLIC_WEB3_RPC_URL` | 区块链 RPC 节点 | `https://mainnet.infura.io/v3/xxx` |
| `VITE_PUBLIC_WEB3_CHAIN_ID` | 链 ID | `1`（以太坊主网） |
| `VITE_APP_USDC_ADDRESS` | USDC 合约地址 | `0xA0b86a33E6...` |

### 可选环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_APP_CHAIN_NAME` | 链名称 | `Ethereum` |
| `VITE_APP_CHAIN_COIN_SYMBOL` | 原生代币符号 | `ETH` |
| `VITE_APP_PAY_TOKEN_NAME` | 支付代币名称 | `USDC` |

## 🧪 测试与质量保证

### 代码检查

```bash
# ESLint 检查
pnpm lint

# 类型检查
tsc --noEmit
```

### 构建验证

```bash
# 构建检查
pnpm build

# 预览检查
pnpm preview
```

## 🔍 故障排除

### 常见问题

#### 1. 环境变量未生效

**症状**: `envConfig` 中的值为 `undefined`

**解决方案**:
- 确保环境变量以 `VITE_PUBLIC_` 开头
- 检查 `.env.local` 文件是否存在
- 重启开发服务器

#### 2. 合约 ABI 加载失败

**症状**: 控制台错误 "未找到合约 [name] 的 ABI 文件"

**解决方案**:
```bash
# 重新复制合约 ABI
pnpm copy-contracts /path/to/contract-project
```

#### 3. 构建失败

**症状**: TypeScript 编译错误

**解决方案**:
- 检查 `tsconfig.json` 配置
- 确保所有依赖已安装
- 检查类型定义文件

#### 4. 部署失败

**症状**: SFTP 连接失败

**解决方案**:
- 检查 SSH 密钥配置
- 验证服务器连接信息
- 确保目标目录权限正确

### 性能优化

- **首屏加载**: 目标 < 2s（理想网络环境）
- **代码分割**: 路由级别自动分割
- **资源优化**: 图片压缩、SVG 组件化
- **缓存策略**: React Query 数据缓存

## 📚 开发指南

### 项目结构

```
src/
├── api/                # API 接口封装
├── components/         # React 组件
│   ├── common/        # 通用组件
│   ├── dialog/        # 对话框组件
│   └── layouts/       # 布局组件
├── contract/          # 智能合约 ABI
├── hooks/             # 自定义 Hook
├── i18n/              # 国际化配置
├── routes/            # 路由配置
├── stores/            # 状态管理
├── types/             # TypeScript 类型
└── utils/             # 工具函数
```

### 开发规范

- **代码风格**: 使用 ESLint + @antfu/eslint-config
- **提交规范**: 使用 Conventional Commits
- **类型安全**: 严格的 TypeScript 配置
- **组件规范**: 函数式组件 + Hooks

## 🔐 安全考虑

- **HTTPS**: 生产环境必须使用 HTTPS
- **环境变量**: 敏感信息通过环境变量管理
- **钱包安全**: 使用 Privy 安全认证
- **XSS 防护**: React 内置 XSS 防护
- **依赖安全**: 定期更新依赖包

## 📞 支持

如遇到问题，请：

1. 查看 [故障排除](#-故障排除) 部分
2. 检查项目 Issues
3. 联系开发团队

## 📄 许可证

[MIT License](LICENSE)

---

**注意**: 部署前请确保所有环境变量已正确配置，特别是区块链相关的配置信息。
