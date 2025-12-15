import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';
import Conf from 'conf';
import ora from 'ora';

const config = new Conf({ projectName: 'daemon-cli' });
const API_URL = process.env.DAEMON_API_URL || 'https://daemon.runfoo.run/api';

export const widgetCommand = new Command('widget')
    .description('Manage your widgets');

widgetCommand
    .command('add')
    .description('Add a new widget to your dashboard')
    .action(async () => {
        const token = config.get('auth.token') as string;
        if (!token) {
            console.log(chalk.red('Please login first using `daemon login`'));
            return;
        }

        const spinner = ora('Fetching widget catalog...').start();

        try {
            // 1. Fetch available widgets (Catalog)
            const { data: catalog } = await axios.get(`${API_URL}/widgets/catalog`);
            spinner.stop();

            // 2. Prompt selection
            const { widgetSlug } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'widgetSlug',
                    message: 'Select a widget to add:',
                    choices: catalog.map((w: any) => ({
                        name: `${chalk.bold(w.name)} - ${chalk.dim(w.description)}`,
                        value: w.slug
                    })),
                    pageSize: 15
                }
            ]);

            // 3. Prompt for layout (simplified for CLI)
            // We'll just ask for a quadrant or auto-place?
            // For MVP, valid Grid is 12 columns. Let's position at 0,0 and let backend/frontend handle collision or just stack.
            // Or better, ask for "Position".

            // Actually, keep it simple: Just add it. The TUI grid I built just renders what it has.
            // But the backend usually requires x,y,w,h.

            // Let's create a default size map.
            const defaultSizes: Record<string, { w: number, h: number }> = {
                'clock': { w: 2, h: 1 },
                'weather': { w: 2, h: 2 },
                'pomodoro': { w: 2, h: 2 },
                'quote': { w: 2, h: 1 },
                // defaults for others
            };

            const size = defaultSizes[widgetSlug] || { w: 2, h: 2 };

            const { position } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'position',
                    message: 'Where should we place it?',
                    choices: [
                        { name: 'Top Left', value: { x: 0, y: 0 } },
                        { name: 'Top Right', value: { x: 2, y: 0 } },
                        { name: 'Bottom Left', value: { x: 0, y: 2 } },
                        { name: 'Bottom Right', value: { x: 2, y: 2 } },
                        // In a real TUI manager, we'd having a visual grid selector!
                    ]
                }
            ]);

            // 4. Config prompt (if needed)
            let widgetConfig = {};
            if (widgetSlug === 'weather') {
                const answers = await inquirer.prompt([
                    { type: 'input', name: 'location', message: 'Enter location (City):', default: 'San Francisco' }
                ]);
                widgetConfig = answers;
            }

            // 5. Install
            const installSpinner = ora('Installing widget...').start();
            await axios.post(`${API_URL}/widgets/active`, {
                slug: widgetSlug,
                position: { ...position, ...size },
                config: widgetConfig
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            installSpinner.succeed(chalk.green(`Widget added! Run \`daemon dashboard\` to see it.`));

        } catch (error: any) {
            spinner.fail('Failed');
            console.error(chalk.red(error.response?.data?.error || error.message));
        }
    });

widgetCommand
    .command('list')
    .description('List your active widgets')
    .action(async () => {
        const token = config.get('auth.token') as string;
        if (!token) return console.log(chalk.red('Please login first.'));

        try {
            const { data: widgets } = await axios.get(`${API_URL}/widgets/active`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (widgets.length === 0) {
                console.log(chalk.yellow('No active widgets.'));
                return;
            }

            console.log(chalk.bold('\nActive Widgets:'));
            widgets.forEach((w: any) => {
                console.log(`${chalk.cyan(w.id)}: ${chalk.white(w.name)} (${w.slug})`);
            });
            console.log('');

        } catch (error: any) {
            console.error(chalk.red(error.message));
        }
    });

widgetCommand
    .command('remove [id]')
    .description('Remove a widget by ID (run list to see IDs)')
    .action(async (id) => {
        const token = config.get('auth.token') as string;
        if (!token) return console.log(chalk.red('Please login first.'));

        // If no ID provided, prompt list
        let targetId = id;

        if (!targetId) {
            const { data: widgets } = await axios.get(`${API_URL}/widgets/active`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (widgets.length === 0) return console.log(chalk.yellow('No widgets to remove.'));

            const { selectedId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedId',
                    message: 'Select widget to remove:',
                    choices: widgets.map((w: any) => ({
                        name: `${w.name} (ID: ${w.id})`,
                        value: w.id
                    }))
                }
            ]);
            targetId = selectedId;
        }

        const spinner = ora('Removing widget...').start();
        try {
            await axios.delete(`${API_URL}/widgets/active/${targetId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            spinner.succeed(chalk.green('Widget removed.'));
        } catch (error: any) {
            spinner.fail('Failed to remove widget');
            console.error(chalk.red(error.message));
        }
    });
