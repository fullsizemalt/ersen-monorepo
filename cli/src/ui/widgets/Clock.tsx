import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Wrapper from './Wrapper.js';

interface ClockProps {
    config?: Record<string, any>;
}

const ClockWidget: React.FC<ClockProps> = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format: HH:MM
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateStr = time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <Wrapper title="Clock" color="blue">
            <Box flexDirection="column" alignItems="center" justifyContent="center">
                <BigText text={timeStr} font="block" colors={['cyan', 'blue']} />
                <Text bold color="white">{dateStr}</Text>
            </Box>
        </Wrapper>
    );
};

export default ClockWidget;
