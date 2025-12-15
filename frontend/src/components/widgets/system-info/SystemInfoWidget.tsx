import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Battery, BatteryCharging, BatteryLow, Wifi, WifiOff, Monitor } from 'lucide-react';

const SystemInfoWidget: React.FC<WidgetProps> = () => {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [screenRes, setScreenRes] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        // Battery API
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setBatteryLevel(Math.round(battery.level * 100));
                setIsCharging(battery.charging);

                battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
                battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
            });
        }

        // Online status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Screen resize
        const handleResize = () => setScreenRes({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const BatteryIcon = isCharging ? BatteryCharging : (batteryLevel && batteryLevel < 20) ? BatteryLow : Battery;

    return (
        <WidgetWrapper title="System">
            <div className="flex flex-col gap-3 h-full justify-center">
                {/* Battery */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BatteryIcon size={16} className={isCharging ? 'text-green-500' : 'text-muted-foreground'} />
                        <span className="text-sm text-muted-foreground">Battery</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                        {batteryLevel !== null ? `${batteryLevel}%` : 'N/A'}
                    </span>
                </div>

                {/* Network */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isOnline ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-red-500" />}
                        <span className="text-sm text-muted-foreground">Network</span>
                    </div>
                    <span className={`text-sm font-medium ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>

                {/* Screen */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Monitor size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Screen</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                        {screenRes.width} × {screenRes.height}
                    </span>
                </div>
            </div>
        </WidgetWrapper>
    );
};

export default SystemInfoWidget;
