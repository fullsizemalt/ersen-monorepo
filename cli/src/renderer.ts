import chalk from 'chalk';
import boxen from 'boxen';

export interface WidgetConfig {
    id: number;
    slug: string;
    config: any;
}

export class WidgetRenderer {
    static render(widget: WidgetConfig): string {
        let content = '';
        switch (widget.slug) {
            case 'clock':
                content = chalk.cyan(new Date().toLocaleTimeString());
                break;
            case 'weather':
                const city = widget.config.city || 'Unknown City';
                content = chalk.yellow(`☀ 72°F ${city}`);
                break;
            case 'system-status':
                content = chalk.green('✔ All Systems Operational');
                break;
            case 'stock-ticker':
                content = chalk.green('▲ AAPL 150.00') + '\n' + chalk.red('▼ TSLA 200.00');
                break;
            default:
                content = chalk.gray(`[${widget.slug}] Widget not supported in CLI`);
        }

        return boxen(content, {
            title: widget.slug.toUpperCase(),
            titleAlignment: 'center',
            padding: 1,
            margin: 0,
            borderStyle: 'round',
            borderColor: 'blue',
            width: 40
        });
    }
}
