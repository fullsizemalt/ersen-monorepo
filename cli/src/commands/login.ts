import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';
import Conf from 'conf';
import ora from 'ora';

const config = new Conf({ projectName: 'daemon-cli' });
const API_URL = process.env.DAEMON_API_URL || 'https://daemon.runfoo.run/api';

export const loginCommand = new Command('login')
    .description('Authenticate with DAEMON')
    .action(async () => {
        console.log(chalk.blue('🔐 DAEMON Login'));

        const { email } = await inquirer.prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Enter your email:',
                validate: (input) => input.includes('@') || 'Please enter a valid email',
            }
        ]);

        const { password } = await inquirer.prompt([
            {
                type: 'password',
                name: 'password',
                message: 'Enter your password (or API Key):',
                mask: '*',
            }
        ]);

        const spinner = ora('Authenticating...').start();

        try {
            const { data } = await axios.post(`${API_URL}/auth/cli-login`, { email, password });

            config.set('auth.token', data.token);
            config.set('user.email', data.user.email);
            config.set('user.name', data.user.name);

            spinner.succeed(chalk.green(`Successfully logged in as ${data.user.email}`));
        } catch (error: any) {
            spinner.fail(chalk.red('Authentication failed'));
            if (axios.isAxiosError(error)) {
                console.error(chalk.red(error.response?.data?.error || error.message));
            } else {
                console.error(error);
            }
        }
    });
