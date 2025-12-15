import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Grid from './components/Grid.js';
import FallbackWidget from './widgets/Fallback.js';
import Wrapper from './widgets/Wrapper.js';
import ClockWidget from './widgets/Clock.js';
import WeatherWidget from './widgets/Weather.js';
import QuoteWidget from './widgets/Quote.js';
import PomodoroWidget from './widgets/Pomodoro.js';

interface AppProps {
    widgets: any[];
    userEmail: string;
}

const WIDGET_MAP: Record<string, React.FC<any>> = {
    'clock': ClockWidget,
    'weather': WeatherWidget,
    'quote': QuoteWidget,
    'pomodoro': PomodoroWidget,
};

const App: React.FC<AppProps> = ({ widgets, userEmail }) => {
    const { exit } = useApp();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Exit on 'q'
    useInput((input) => {
        if (input === 'q') {
            exit();
        }
    });

    // Clock ticker
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Map raw widgets to Grid Items
    const gridItems = widgets.map(w => {
        const Component = WIDGET_MAP[w.slug];

        return {
            id: w.id,
            x: w.position.x,
            y: w.position.y,
            w: w.position.w,
            h: w.position.h,
            component: Component ? (
                <Component config={w.config} />
            ) : (
                <FallbackWidget name={w.name} slug={w.slug} config={w.config} />
            )
        };
    });

    return (
        <Box flexDirection="column" padding={1} borderColor="cyan" borderStyle="round">
            {/* Header ... */}
            <Box marginBottom={1}>
                <Gradient name="morning">
                    <BigText text="DAEMON" font="tiny" />
                </Gradient>
            </Box>

            <Box marginBottom={1}>
                <Text color="green">👋 Welcome, {userEmail} </Text>
                <Text color="gray"> | </Text>
                <Text color="yellow">{currentTime.toLocaleTimeString()}</Text>
                <Text color="gray"> | </Text>
                <Text dimColor>Press 'q' to exit</Text>
            </Box>

            {/* Main Grid */}
            <Grid items={gridItems} />
        </Box>
    );
};

export default App;
