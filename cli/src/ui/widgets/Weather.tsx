import React from 'react';
import { Box, Text } from 'ink';
import Wrapper from './Wrapper.js';

interface WeatherProps {
    config?: { description?: string, location?: string };
}

const WeatherWidget: React.FC<WeatherProps> = ({ config }) => {
    const location = config?.location || 'Unknown';

    // Mock data for TUI
    const temp = 72;
    const condition = 'Sunny';

    // ASCII Art for Sun
    const icon = `
      \\   /
       .-.
    ― (   ) ―
       \`-\`
      /   \\
    `;

    return (
        <Wrapper title="Weather" color="yellow">
            <Box flexDirection="row" alignItems="center" justifyContent="center">
                <Box marginRight={2}>
                    <Text color="yellow">{icon}</Text>
                </Box>
                <Box flexDirection="column">
                    <Text bold color="white" underline>{location}</Text>
                    <Text color="cyan" bold>{temp}°F</Text>
                    <Text color="gray">{condition}</Text>
                </Box>
            </Box>
        </Wrapper>
    );
};

export default WeatherWidget;
