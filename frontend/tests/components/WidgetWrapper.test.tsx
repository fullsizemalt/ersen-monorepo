/**
 * Component tests for WidgetWrapper
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import WidgetWrapper, { WidgetErrorBoundary } from '../../src/components/widgets/WidgetWrapper';

// Component that throws an error
const ThrowingComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return <div>Normal content</div>;
};

// Suppress console.error for error boundary tests
const originalError = console.error;
beforeAll(() => {
    console.error = vi.fn();
});
afterAll(() => {
    console.error = originalError;
});

describe('WidgetWrapper', () => {
    it('should render children correctly', () => {
        render(
            <WidgetWrapper title="Test Widget">
                <div>Test content</div>
            </WidgetWrapper>
        );

        expect(screen.getByText('Test Widget')).toBeInTheDocument();
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should display widget title in header', () => {
        render(
            <WidgetWrapper title="Clock">
                <div>Clock content</div>
            </WidgetWrapper>
        );

        const header = screen.getByText('Clock');
        expect(header).toHaveClass('uppercase', 'tracking-widest');
    });

    it('should apply custom className', () => {
        const { container } = render(
            <WidgetWrapper title="Test" className="custom-class">
                <div>Content</div>
            </WidgetWrapper>
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });
});

describe('WidgetErrorBoundary', () => {
    it('should render children when no error', () => {
        render(
            <WidgetErrorBoundary widgetTitle="Test">
                <div>Safe content</div>
            </WidgetErrorBoundary>
        );

        expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('should show error UI when child throws', () => {
        render(
            <WidgetErrorBoundary widgetTitle="Broken Widget">
                <ThrowingComponent shouldThrow={true} />
            </WidgetErrorBoundary>
        );

        expect(screen.getByText('Widget Error')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should call onRetry when retry button clicked', () => {
        const onRetry = vi.fn();

        render(
            <WidgetErrorBoundary widgetTitle="Broken Widget" onRetry={onRetry}>
                <ThrowingComponent shouldThrow={true} />
            </WidgetErrorBoundary>
        );

        const retryButton = screen.getByRole('button', { name: /retry/i });
        fireEvent.click(retryButton);

        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should isolate errors to individual widgets', () => {
        const { container } = render(
            <div>
                <WidgetErrorBoundary widgetTitle="Widget 1">
                    <div>Widget 1 is fine</div>
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetTitle="Widget 2">
                    <ThrowingComponent shouldThrow={true} />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetTitle="Widget 3">
                    <div>Widget 3 is fine</div>
                </WidgetErrorBoundary>
            </div>
        );

        // Widget 1 and 3 should render normally
        expect(screen.getByText('Widget 1 is fine')).toBeInTheDocument();
        expect(screen.getByText('Widget 3 is fine')).toBeInTheDocument();

        // Widget 2 should show error
        expect(screen.getByText('Widget Error')).toBeInTheDocument();
    });
});
