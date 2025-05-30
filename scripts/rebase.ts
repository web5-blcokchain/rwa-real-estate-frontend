import { execSync } from 'child_process';

function run(cmd: string) {
  try {
    console.log(`\n$ ${cmd}`);
    const output = execSync(cmd, { stdio: 'inherit' });
    return output;
  } catch (err) {
    console.error(`命令执行失败: ${cmd}`);
    process.exit(1);
  }
}

function main() {
  run('git rebase main deploy');
  run('git push');
  run('git rebase main preview');
  run('git push');
  run('git switch main');
}

main();
