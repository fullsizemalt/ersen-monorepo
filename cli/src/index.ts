import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';

import { loginCommand } from './commands/login.js';
import { logoutCommand } from './commands/logout.js';
import { dashboardCommand } from './commands/dashboard.js';
import { widgetCommand } from './commands/widget.js';

const program = new Command();

console.log(boxen(chalk.bold.red('DAEMON 2.0 CLI'), { padding: 1, borderStyle: 'round', borderColor: 'red' }));

program
    .name('daemon')
    .description('CLI for DAEMON 2.0 Personal OS')
    .version('0.0.1');

program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(dashboardCommand);
program.addCommand(widgetCommand);

program.parse(process.argv);
