import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';


const AgeWidget: React.FC<WidgetProps> = ({ config }) => {
    const birthDate = config.birthDate ? new Date(config.birthDate) : new Date('1990-01-01');
    const [age, setAge] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [lifeProgress, setLifeProgress] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const diff = now.getTime() - birthDate.getTime();

            const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
            const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
            const days = Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
            const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((diff % (60 * 1000)) / 1000);

            setAge({ years, months, days, hours, minutes, seconds });

            // Life progress (assuming 80 year lifespan)
            const totalExpectedMs = 80 * 365.25 * 24 * 60 * 60 * 1000;
            setLifeProgress(Math.min((diff / totalExpectedMs) * 100, 100));
        };

        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [birthDate]);

    return (
        <WidgetWrapper title="Age Calculator">
            <div className="flex flex-col h-full justify-center">
                <div className="text-center mb-3">
                    <span className="text-3xl font-bold text-foreground">{age.years}</span>
                    <span className="text-lg text-muted-foreground ml-1">years old</span>
                </div>

                <div className="grid grid-cols-5 gap-1 text-center mb-3">
                    {[
                        { value: age.months, label: 'mo' },
                        { value: age.days, label: 'd' },
                        { value: age.hours, label: 'h' },
                        { value: age.minutes, label: 'm' },
                        { value: age.seconds, label: 's' },
                    ].map(({ value, label }) => (
                        <div key={label} className="bg-muted/30 rounded p-1">
                            <div className="text-sm font-medium text-foreground tabular-nums">{value}</div>
                            <div className="text-[10px] text-muted-foreground">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Life progress bar */}
                <div className="mt-auto">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Life progress</span>
                        <span>{lifeProgress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-1000"
                            style={{ width: `${lifeProgress}%` }}
                        />
                    </div>
                </div>
            </div>
        </WidgetWrapper>
    );
};

export default AgeWidget;
