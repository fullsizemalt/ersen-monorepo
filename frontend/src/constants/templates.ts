
import {
    Server, ChefHat, Briefcase, GraduationCap, Code, Heart, LucideIcon
} from 'lucide-react';

export interface LayoutWidgetConfig {
    slug: string;
    x: number;
    y: number;
    w: number;
    h: number;
    config?: Record<string, any>;
}

export interface PersonaTemplate {
    id: string;
    name: string;
    title: string;
    description: string;
    iconName: 'Server' | 'ChefHat' | 'Briefcase' | 'GraduationCap' | 'Code' | 'Heart';
    color: string;
    gradient: string;
    widgets: LayoutWidgetConfig[];
    features: string[];
}

export const PERSONA_TEMPLATES: PersonaTemplate[] = [
    {
        id: 'sysadmin',
        name: 'SysAdmin',
        title: 'Infrastructure Ops',
        description: 'Monitor servers, containers, and services at a glance.',
        iconName: 'Server',
        color: 'text-orange-500',
        gradient: 'from-orange-500/20 to-red-500/20',
        features: ['Live metrics', 'Container status', 'SSH access'],
        widgets: [
            { slug: 'grafana', x: 0, y: 0, w: 4, h: 3 },
            { slug: 'prometheus', x: 4, y: 0, w: 2, h: 3 },
            { slug: 'system-info', x: 0, y: 3, w: 2, h: 2 },
            { slug: 'quick-links', x: 2, y: 3, w: 2, h: 2 },
            { slug: 'clock', x: 4, y: 3, w: 2, h: 1 },
        ],
    },
    {
        id: 'developer',
        name: 'Developer',
        title: 'Code & Ship',
        description: 'GitHub activity, quick links to repos, and focus timers.',
        iconName: 'Code',
        color: 'text-cyan-500',
        gradient: 'from-cyan-500/20 to-teal-500/20',
        features: ['GitHub PRs', 'Repo access', 'AI Assistant', '2FA'],
        widgets: [
            { slug: 'github', x: 0, y: 0, w: 2, h: 3 },
            { slug: 'ai-assistant', x: 2, y: 0, w: 2, h: 3 },
            { slug: 'quick-links', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'authenticator', x: 4, y: 2, w: 2, h: 2 },
            { slug: 'pomodoro', x: 0, y: 3, w: 2, h: 2 },
            { slug: 'clock', x: 2, y: 3, w: 2, h: 1 },
        ],
    },
    {
        id: 'homechef',
        name: 'Home Chef',
        title: 'Kitchen Command Center',
        description: 'Timers, recipes, and music control.',
        iconName: 'ChefHat',
        color: 'text-green-500',
        gradient: 'from-green-500/20 to-emerald-500/20',
        features: ['Cooking timers', 'Spotify', 'Recipes'],
        widgets: [
            { slug: 'stopwatch', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'countdown', x: 2, y: 0, w: 2, h: 1 },
            { slug: 'countdown', x: 2, y: 1, w: 2, h: 1 },
            { slug: 'spotify', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'sticky-notes', x: 0, y: 2, w: 4, h: 2 },
            { slug: 'quick-links', x: 4, y: 2, w: 2, h: 2 },
        ],
    },
    {
        id: 'wellness',
        name: 'Wellness',
        title: 'Mind & Body',
        description: 'Track habits, moods, water intake, and mindfulness.',
        iconName: 'Heart',
        color: 'text-rose-500',
        gradient: 'from-rose-500/20 to-pink-500/20',
        features: ['Breathing', 'Hydration', 'Mood Log', 'Habits'],
        widgets: [
            { slug: 'breathing', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'water-tracker', x: 2, y: 0, w: 2, h: 2 },
            { slug: 'mood-tracker', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'habit-tracker', x: 0, y: 2, w: 2, h: 2 },
            { slug: 'quote', x: 2, y: 2, w: 2, h: 1 },
            { slug: 'weather', x: 2, y: 3, w: 2, h: 1 },
        ],
    },
    {
        id: 'poweruser',
        name: 'Power Admin',
        title: 'Executive Dashboard',
        description: 'Email, calendar, tasks, and communications.',
        iconName: 'Briefcase',
        color: 'text-blue-500',
        gradient: 'from-blue-500/20 to-indigo-500/20',
        features: ['Calendar', 'Email', 'Tasks'],
        widgets: [
            { slug: 'google-calendar', x: 0, y: 0, w: 2, h: 3 },
            { slug: 'gmail', x: 2, y: 0, w: 2, h: 3 },
            { slug: 'task-manager', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'quick-links', x: 4, y: 2, w: 2, h: 1 },
            { slug: 'clock', x: 0, y: 3, w: 2, h: 1 },
            { slug: 'weather', x: 2, y: 3, w: 2, h: 1 },
        ],
    },
    {
        id: 'student',
        name: 'Student',
        title: 'Study Mode',
        description: 'Focus timer, assignments, and exam countdowns.',
        iconName: 'GraduationCap',
        color: 'text-purple-500',
        gradient: 'from-purple-500/20 to-pink-500/20',
        features: ['Pomodoro', 'Assignments', 'Exams'],
        widgets: [
            { slug: 'pomodoro', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'task-manager', x: 2, y: 0, w: 2, h: 2 },
            { slug: 'countdown', x: 4, y: 0, w: 2, h: 1 },
            { slug: 'calculator', x: 4, y: 1, w: 2, h: 2 },
            { slug: 'sticky-notes', x: 0, y: 2, w: 2, h: 2 },
            { slug: 'quote', x: 2, y: 2, w: 2, h: 1 },
        ],
    },
];

export const ICONS_MAP: Record<string, LucideIcon> = {
    'Server': Server,
    'ChefHat': ChefHat,
    'Briefcase': Briefcase,
    'GraduationCap': GraduationCap,
    'Code': Code,
    'Heart': Heart,
};
