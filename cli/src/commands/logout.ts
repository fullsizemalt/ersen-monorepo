import { Command } from 'commander';
import chalk from 'chalk';
import Conf from 'conf';

const config = new Conf({ projectName: 'daemon-cli' });

export const logoutCommand = new Command('logout')
    .description('Log out from DAEMON')
    .action(() => {
        config.delete('auth.token');
        config.delete('user.email');
        config.delete('user.name');
        console.log(chalk.green('✔ Successfully logged out.'));
    });
