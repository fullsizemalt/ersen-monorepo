import { Command } from 'commander';
import React from 'react';
import chalk from 'chalk';
import ora from 'ora';
import Conf from 'conf';
import { WidgetRenderer } from '../renderer.js';
import axios from 'axios';

const config = new Conf({ projectName: 'daemon-cli' });

const API_URL = process.env.DAEMON_API_URL || 'https://daemon.runfoo.run/api';

const DEMO_WIDGETS = [
    { id: 1, name: 'Clock', slug: 'clock', config: {}, position: { x: 0, y: 0, w: 2, h: 1 } },
    { id: 2, name: 'Weather', slug: 'weather', config: { location: 'San Francisco' }, position: { x: 2, y: 0, w: 2, h: 2 } },
    { id: 3, name: 'Quote', slug: 'quote', config: {}, position: { x: 0, y: 1, w: 2, h: 1 } },
    { id: 5, name: 'Pomodoro', slug: 'pomodoro', config: {}, position: { x: 2, y: 2, w: 2, h: 2 } },
];

export const dashboardCommand = new Command('dashboard')
    .description('View your DAEMON dashboard')
    .option('--demo', 'Run in demo mode without backend connection')
    .action(async (options) => {
        let widgets = [];

        if (options.demo) {
            console.log(chalk.yellow('🧪 Running in Demo Mode'));
            widgets = DEMO_WIDGETS;
        } else {
            const userEmail = config.get('user.email') as string;
            const token = config.get('auth.token') as string;

            if (!userEmail || !token) {
                console.log(chalk.red('Please login first using `daemon login`'));
                return;
            }

            console.log(chalk.bold.white(`\n👋 Welcome back, ${userEmail}\n`));
            const spinner = ora('Fetching widgets...').start();

            try {
                const { data } = await axios.get(`${API_URL}/widgets/active`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                widgets = data;
                spinner.stop();
            } catch (error: any) {
                spinner.fail(chalk.red('Failed to fetch widgets'));
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    console.log(chalk.red('Session expired. Please login again.'));
                } else if (!axios.isAxiosError(error) || error.code === 'ECONNREFUSED' || error.response?.status === 502) {
                    console.log(chalk.yellow('\n💡 Tip: Backend unavailable? Try `daemon dashboard --demo` to see it in action!'));
                } else {
                    console.error(chalk.red(error.message));
                }
                return;
            }
        }

        if (widgets.length === 0) {
            console.log(chalk.yellow('\n⚠️  No active widgets found.'));
            console.log(chalk.white('   Manage your dashboard configuration here:'));
            console.log(chalk.cyan.underline('   https://daemon.runfoo.run/dashboard\n'));
            return;
        }

        // Launch TUI
        const { render } = await import('ink');
        const App = (await import('../ui/App.js')).default; // Note .js extension for ESM

        const { waitUntilExit } = render(React.createElement(App, {
            widgets,
            userEmail: config.get('user.email') as string || 'Guest'
        }));

        await waitUntilExit();
    });
