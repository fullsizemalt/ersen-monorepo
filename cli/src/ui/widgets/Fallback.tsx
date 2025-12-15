import React from 'react';
import { Text } from 'ink';
import Wrapper from './Wrapper.js';

interface FallbackProps {
    name: string;
    slug: string;
    config?: any;
}

const FallbackWidget: React.FC<FallbackProps> = ({ name, slug, config }) => {
    return (
        <Wrapper title={name || slug} color="gray">
            <Text>Slug: {slug}</Text>
            <Text dimColor>Not implemented in CLI</Text>
            {config && <Text dimColor>{JSON.stringify(config)}</Text>}
        </Wrapper>
    );
};

export default FallbackWidget;
