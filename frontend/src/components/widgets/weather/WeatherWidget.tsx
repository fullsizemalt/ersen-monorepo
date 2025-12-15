import React, { useState, useEffect, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react';

interface WeatherData {
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    location: string;
    forecast: {
        day: string;
        tempHigh: number;
        tempLow: number;
        condition: string;
    }[];
}

// Fallback mock data when API is unavailable
const FALLBACK_WEATHER: WeatherData = {
    temp: 72,
    feelsLike: 70,
    condition: 'Partly Cloudy',
    humidity: 45,
    windSpeed: 8,
    location: 'San Francisco',
    forecast: [
        { day: 'Mon', tempHigh: 75, tempLow: 58, condition: 'Sunny' },
        { day: 'Tue', tempHigh: 68, tempLow: 54, condition: 'Rain' },
        { day: 'Wed', tempHigh: 70, tempLow: 56, condition: 'Cloudy' },
    ]
};

// Map wttr.in weather codes to icons
const getWeatherIcon = (condition: string, size = 24) => {
    const c = condition.toLowerCase();
    if (c.includes('thunder') || c.includes('lightning'))
        return <CloudLightning size={size} className="text-yellow-300" />;
    if (c.includes('sun') || c.includes('clear') || c.includes('fair'))
        return <Sun size={size} className="text-yellow-400" />;
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower'))
        return <CloudRain size={size} className="text-blue-400" />;
    if (c.includes('snow') || c.includes('sleet') || c.includes('ice') || c.includes('frost'))
        return <CloudSnow size={size} className="text-white" />;
    if (c.includes('overcast') || c.includes('cloud'))
        return <Cloud size={size} className="text-zinc-400" />;
    return <Sun size={size} className="text-yellow-400" />;
};

const WeatherWidget: React.FC<WidgetProps> = ({ config }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const location = config.location || 'auto';
    const units = config.units || 'f'; // 'f' for Fahrenheit, 'c' for Celsius

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Use wttr.in - free weather API, no key required
            const locationQuery = location === 'auto' ? '' : encodeURIComponent(location);
            const response = await fetch(`https://wttr.in/${locationQuery}?format=j1`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Weather service unavailable');
            }

            const data = await response.json();
            const current = data.current_condition[0];
            const area = data.nearest_area?.[0];

            // Convert temperature based on units preference
            const temp = units === 'f'
                ? parseInt(current.temp_F)
                : parseInt(current.temp_C);
            const feelsLike = units === 'f'
                ? parseInt(current.FeelsLikeF)
                : parseInt(current.FeelsLikeC);

            // Build forecast from weather data
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();

            const forecast = data.weather.slice(0, 3).map((day: any, index: number) => {
                const date = new Date(today);
                date.setDate(date.getDate() + index);
                return {
                    day: dayNames[date.getDay()],
                    tempHigh: units === 'f'
                        ? parseInt(day.maxtempF)
                        : parseInt(day.maxtempC),
                    tempLow: units === 'f'
                        ? parseInt(day.mintempF)
                        : parseInt(day.mintempC),
                    condition: day.hourly[4]?.weatherDesc?.[0]?.value || 'Clear',
                };
            });

            setWeather({
                temp,
                feelsLike,
                condition: current.weatherDesc[0]?.value || 'Unknown',
                humidity: parseInt(current.humidity),
                windSpeed: parseInt(current.windspeedMiles),
                location: area?.areaName?.[0]?.value || location,
                forecast,
            });
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError('Unable to fetch weather');
            // Use fallback data so widget still looks good
            setWeather(FALLBACK_WEATHER);
        } finally {
            setLoading(false);
        }
    }, [location, units]);

    useEffect(() => {
        fetchWeather();
        // Refresh weather every 15 minutes
        const interval = setInterval(fetchWeather, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchWeather, retryCount]);

    const handleRefresh = () => {
        setRetryCount(prev => prev + 1);
    };

    if (loading && !weather) {
        return (
            <WidgetWrapper title="Weather">
                <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-400 rounded-full animate-spin" />
                        <span className="text-xs text-zinc-500">Loading weather...</span>
                    </div>
                </div>
            </WidgetWrapper>
        );
    }

    if (!weather) {
        return (
            <WidgetWrapper title="Weather" onRetry={handleRefresh}>
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <Cloud className="w-10 h-10 text-zinc-600 mb-2" />
                    <p className="text-sm text-zinc-500">{error || 'No weather data'}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                        Try again
                    </button>
                </div>
            </WidgetWrapper>
        );
    }

    return (
        <WidgetWrapper title="Weather" onRetry={handleRefresh}>
            <div className="flex flex-col h-full">
                {/* Current Weather */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-zinc-900 dark:text-white">{weather.temp}°</span>
                            <span className="text-lg text-zinc-500">{units.toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{weather.condition}</span>
                        <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                            <MapPin size={10} />
                            <span>{weather.location}</span>
                        </div>
                    </div>
                    <div className="relative">
                        {getWeatherIcon(weather.condition, 48)}
                        {loading && (
                            <div className="absolute -top-1 -right-1">
                                <RefreshCw size={12} className="text-blue-400 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-4 mb-4 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <Droplets size={12} className="text-blue-500 dark:text-blue-400" />
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <Wind size={12} className="text-zinc-500 dark:text-zinc-400" />
                        <span>{weather.windSpeed} mph</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <span className="text-zinc-500">Feels</span>
                        <span>{weather.feelsLike}°</span>
                    </div>
                </div>

                {/* Forecast */}
                <div className="flex justify-between pt-3 border-t border-zinc-200 dark:border-white/5 mt-auto">
                    {weather.forecast.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <span className="text-[10px] text-zinc-500 font-medium">{day.day}</span>
                            {getWeatherIcon(day.condition, 16)}
                            <div className="flex gap-1 text-xs">
                                <span className="text-zinc-700 dark:text-zinc-300">{day.tempHigh}°</span>
                                <span className="text-zinc-400 dark:text-zinc-600">{day.tempLow}°</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error indicator */}
                {error && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500/10 text-red-400 text-[10px] text-center py-0.5">
                        Using cached data
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export default WeatherWidget;
