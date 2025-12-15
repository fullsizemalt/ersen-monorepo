import React from 'react';
import { Box, Text } from 'ink';
import Wrapper from './Wrapper.js';

interface QuoteProps {
    config?: Record<string, any>;
}

const QuoteWidget: React.FC<QuoteProps> = () => {
    // Mock quote
    const text = "The only way to do great work is to love what you do.";
    const author = "Steve Jobs";

    return (
        <Wrapper title="Quote" color="magenta">
            <Box flexDirection="column" paddingX={1}>
                <Text italic>"{text}"</Text>
                <Box marginTop={1} justifyContent="flex-end">
                    <Text dimColor>— {author}</Text>
                </Box>
            </Box>
        </Wrapper>
    );
};

export default QuoteWidget;
