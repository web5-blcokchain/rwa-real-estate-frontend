import { execSync } from 'node:child_process'

function getGitBranch(): string {
  try {
    const output = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8'
    }).trim()
    return output
  } catch {
    return ''
  }
}

const branch = getGitBranch()
const mode = branch === 'preview' ? 'development' : 'production'

console.log(`[build] current branch: ${branch}, using mode: ${mode}`)

execSync(`vite build --mode ${mode}`, { stdio: 'inherit' })
