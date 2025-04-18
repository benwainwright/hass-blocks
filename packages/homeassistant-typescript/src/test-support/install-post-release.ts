import { exec } from 'child_process';
import { promisify } from 'util';
import { getPackageName } from './get-package-name.ts';

export const setup = async () => {
  const packageName = getPackageName();
  const execCommand = promisify(exec);
  await execCommand(`npm install npm:${packageName}@latest`);
};
