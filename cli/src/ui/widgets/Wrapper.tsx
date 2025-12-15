import React from 'react';
import { Box, Text } from 'ink';

interface WrapperProps {
    title: string;
    children: React.ReactNode;
    color?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ title, children, color = 'cyan' }) => {
    return (
        <Box flexDirection="column" borderStyle="round" borderColor={color} paddingX={1} height="100%">
            <Box position="absolute" marginTop={-1} marginLeft={1}>
                <Text color={color} bold> {title.toUpperCase()} </Text>
            </Box>
            <Box flexDirection="column" flexGrow={1}>
                {children}
            </Box>
        </Box>
    );
};

export default Wrapper;
