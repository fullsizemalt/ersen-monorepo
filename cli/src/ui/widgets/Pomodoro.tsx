import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Wrapper from './Wrapper.js';

interface PomodoroProps {
    config?: Record<string, any>;
}

const PomodoroWidget: React.FC<PomodoroProps> = () => {
    // Simple 25m timer simulation for TUI
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, secondsLeft]);

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = Math.floor(((25 * 60 - secondsLeft) / (25 * 60)) * 20); // 20 chars wide
    const progressBar = '█'.repeat(progress) + '░'.repeat(20 - progress);

    return (
        <Wrapper title="Pomodoro" color="red">
            <Box flexDirection="column" alignItems="center">
                <Text bold color={isActive ? "red" : "gray"} backgroundColor={isActive ? undefined : "black"}>
                    {isActive ? "FOCUS" : "PAUSED"}
                </Text>

                <Box marginY={0}>
                    <BigText text={formatTime(secondsLeft)} font="block" colors={['white', 'white']} />
                </Box>

                <Text color="red">{progressBar}</Text>

                <Box marginTop={1}>
                    <Text dimColor>(Use space to toggle - WIP)</Text>
                </Box>
            </Box>
        </Wrapper>
    );
};

export default PomodoroWidget;
