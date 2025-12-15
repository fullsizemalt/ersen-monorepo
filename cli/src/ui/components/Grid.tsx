import React, { useState, useEffect } from 'react';
import { Box, useStdout } from 'ink';

interface GridItem {
    id: string | number;
    x: number;
    y: number;
    w: number;
    h: number;
    component: React.ReactNode;
}

interface GridProps {
    items: GridItem[];
    rowHeight?: number;
}

const Grid: React.FC<GridProps> = ({ items, rowHeight = 5 }) => {
    const { stdout } = useStdout();
    const [cols, setCols] = useState(12); // Default to full 12-col system
    const [width, setWidth] = useState(stdout?.columns || 80);

    useEffect(() => {
        if (!stdout) return;

        const onResize = () => {
            setWidth(stdout.columns);
        };

        stdout.on('resize', onResize);
        return () => {
            stdout.off('resize', onResize);
        };
    }, [stdout]);

    // Simple strategy: 
    // If width < 80, stack everything (1 col).
    // If width >= 80, use 12-col grid approximation.

    // Sort items by Y then X to ensure correct stack order if we flatten
    const sortedItems = [...items].sort((a, b) => {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
    });

    if (width < 80) {
        // Mobile/Narrow view: Stack everything
        return (
            <Box flexDirection="column">
                {sortedItems.map(item => (
                    <Box key={item.id} marginBottom={1}>
                        {item.component}
                    </Box>
                ))}
            </Box>
        );
    }

    // Wide view: Try to respect grid
    // We treat the terminal width as 12 units.
    // Each unit width = total_width / 12 (approx)

    // Since Ink uses Flexbox, we can't easily do absolute positioning like CSS Grid.
    // However, we can use a recursive row rendering or just render absolute rows?
    // Ink doesn't support absolute positioning relative to container nicely yet without 'ink-box' tricks.

    // Alternative: Render purely by rows.
    // Group items by 'y' (assuming they align to rows).

    // Let's stick to a simpler logic for V1:
    // Render items in a flex-wrap container, assigning width % based on item.w

    return (
        <Box flexDirection="row" flexWrap="wrap">
            {sortedItems.map(item => {
                const widthPercent = (item.w / 12) * 100;
                return (
                    <Box key={item.id} width={`${widthPercent}%`} height={item.h * rowHeight} padding={1}>
                        {item.component}
                    </Box>
                );
            })}
        </Box>
    );
};

export default Grid;
