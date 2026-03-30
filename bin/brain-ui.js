#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseArgs } from 'util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const { values } = parseArgs({
	options: {
		port: { type: 'string', short: 'p', default: '5173' },
		'brain-port': { type: 'string', short: 'b', default: '3111' },
		help: { type: 'boolean', short: 'h', default: false }
	},
	allowPositionals: false
});

if (values.help) {
	console.log(`Usage: brain-ui [options]

Options:
  -p, --port <port>        Dev server port (default: 5173)
  -b, --brain-port <port>  Brain API port on localhost (default: 3111)
  -h, --help               Show this help
`);
	process.exit(0);
}

console.log('Installing dependencies...');
execSync('npm install', { cwd: root, stdio: 'inherit' });

const env = {
	...process.env,
	PUBLIC_BRAIN_URL: `http://localhost:${values['brain-port']}`
};

console.log(`Starting Brain UI on :${values.port} → Brain at localhost:${values['brain-port']}`);
execSync(`npm run dev -- --port ${values.port} --open`, { cwd: root, stdio: 'inherit', env });
