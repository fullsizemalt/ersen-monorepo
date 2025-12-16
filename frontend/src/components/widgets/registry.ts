import React from 'react';
import { WidgetManifest, WidgetCategory } from '../../types/widget';

// Lazy load widgets
const ClockWidget = React.lazy(() => import('./clock/ClockWidget'));
const TaskWidget = React.lazy(() => import('./task-manager/TaskWidget'));
const StickyNotesWidget = React.lazy(() => import('./sticky-notes/StickyNotesWidget'));
const WeatherWidget = React.lazy(() => import('./weather/WeatherWidget'));
const CalculatorWidget = React.lazy(() => import('./calculator/CalculatorWidget'));
const PomodoroWidget = React.lazy(() => import('./pomodoro/PomodoroWidget'));
const QuoteWidget = React.lazy(() => import('./quote/QuoteWidget'));
const HabitTrackerWidget = React.lazy(() => import('./habit-tracker/HabitTrackerWidget'));
const MoodTrackerWidget = React.lazy(() => import('./mood/MoodTrackerWidget')); // Path fixed
const JournalWidget = React.lazy(() => import('./journal/JournalWidget'));
const CreativePromptsWidget = React.lazy(() => import('./creative/CreativePromptsWidget'));
const FlashCardsWidget = React.lazy(() => import('./flashcards/FlashCardsWidget'));
const ToyboxWidget = React.lazy(() => import('./toybox/ToyboxWidget'));
const HeatmapWidget = React.lazy(() => import('./heatmap/HeatmapWidget'));
const AiAssistantWidget = React.lazy(() => import('./ai-assistant/AiAssistantWidget'));
const KanbanWidget = React.lazy(() => import('./kanban/KanbanWidget'));
const SpotifyWidget = React.lazy(() => import('./spotify/SpotifyWidget'));
const GithubWidget = React.lazy(() => import('./github/GithubWidget'));
const GmailWidget = React.lazy(() => import('./gmail/GmailWidget'));
const GoogleCalendarWidget = React.lazy(() => import('./google-calendar/GoogleCalendarWidget'));
const ObsidianWidget = React.lazy(() => import('./obsidian/ObsidianWidget'));
const NewsFeedWidget = React.lazy(() => import('./news-feed/NewsFeedWidget'));
const StockTickerWidget = React.lazy(() => import('./stock-ticker/StockTickerWidget'));
const CryptoTrackerWidget = React.lazy(() => import('./crypto-tracker/CryptoTrackerWidget'));
const GrafanaWidget = React.lazy(() => import('./grafana/GrafanaWidget'));
const PrometheusWidget = React.lazy(() => import('./prometheus/PrometheusWidget'));
const JellyfinWidget = React.lazy(() => import('./jellyfin/JellyfinWidget'));
const PlexWidget = React.lazy(() => import('./plex/PlexWidget'));
const AudiobookshelfWidget = React.lazy(() => import('./audiobookshelf/AudiobookshelfWidget'));

// Free utility widgets
const CountdownWidget = React.lazy(() => import('./countdown/CountdownWidget'));
const SystemInfoWidget = React.lazy(() => import('./system-info/SystemInfoWidget'));
const DiceRollerWidget = React.lazy(() => import('./dice-roller/DiceRollerWidget'));
const ColorPaletteWidget = React.lazy(() => import('./color-palette/ColorPaletteWidget'));
const StopwatchWidget = React.lazy(() => import('./stopwatch/StopwatchWidget'));
const UnitConverterWidget = React.lazy(() => import('./unit-converter/UnitConverterWidget'));
const WorldClockWidget = React.lazy(() => import('./world-clock/WorldClockWidget'));
const PasswordGeneratorWidget = React.lazy(() => import('./password-generator/PasswordGeneratorWidget'));
const WaterTrackerWidget = React.lazy(() => import('./water-tracker/WaterTrackerWidget'));
const BreathingWidget = React.lazy(() => import('./breathing/BreathingWidget'));
const AgeWidget = React.lazy(() => import('./age-calculator/AgeWidget'));
const QuickLinksWidget = React.lazy(() => import('./quick-links/QuickLinksWidget'));
const AuthenticatorWidget = React.lazy(() => import('./authenticator/AuthenticatorWidget'));
const QrCodeWidget = React.lazy(() => import('./qr-code/QrCodeWidget'));

// Visual & Aesthetic
const FlipBoardWidget = React.lazy(() => import('./retro-flip/FlipBoardWidget'));
const PhotoFrameWidget = React.lazy(() => import('./photo-frame/PhotoFrameWidget'));
const ScreensaverWidget = React.lazy(() => import('./screensaver/ScreensaverWidget'));

// specialized
const StreamerToolsWidget = React.lazy(() => import('./streamer-tools/StreamerToolsWidget'));

// Note: Ambiance is now a global background feature via AmbianceContext, not a widget


// Games
const Magic8BallWidget = React.lazy(() => import('./magic-8-ball/Magic8BallWidget'));
const CoinFlipWidget = React.lazy(() => import('./coin-flip/CoinFlipWidget'));
const TicTacToeWidget = React.lazy(() => import('./tic-tac-toe/TicTacToeWidget'));
const SnakeWidget = React.lazy(() => import('./snake/SnakeWidget'));
const SnakeWidget = React.lazy(() => import('./snake/SnakeWidget'));
const MinesweeperWidget = React.lazy(() => import('./minesweeper/MinesweeperWidget'));
const TraktWidget = React.lazy(() => import('./trakt/TraktWidget'));
const LetterboxdWidget = React.lazy(() => import('./letterboxd/LetterboxdWidget'));
const SleepWidget = React.lazy(() => import('./sleep/SleepWidget'));
const FitnessRingWidget = React.lazy(() => import('./fitness/FitnessRingWidget'));
const SocialFeedWidget = React.lazy(() => import('./social/SocialFeedWidget'));

export const WIDGET_REGISTRY: Record<string, WidgetManifest> = {
    // ═══════════════════════════════════════════════════════════════════
    // TIME & FOCUS
    // ═══════════════════════════════════════════════════════════════════
    'clock': {
        slug: 'clock',
        name: 'Clock',
        description: 'Digital clock with date',
        icon: '🕐',
        category: 'time',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 1 },
        supportedSizes: [{ w: 2, h: 1 }, { w: 4, h: 2 }],
        component: ClockWidget,
    },
    'world-clock': {
        slug: 'world-clock',
        name: 'World Clock',
        description: 'Multiple time zones',
        icon: '🌍',
        category: 'time',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: WorldClockWidget,
    },
    'stopwatch': {
        slug: 'stopwatch',
        name: 'Stopwatch',
        description: 'Timer with lap times',
        icon: '⏱️',
        category: 'time',
        tags: ['utility', 'focus'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: StopwatchWidget,
    },
    'countdown': {
        slug: 'countdown',
        name: 'Countdown',
        description: 'Count down to events',
        icon: '⏳',
        category: 'time',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 1 },
        supportedSizes: [{ w: 2, h: 1 }, { w: 4, h: 1 }],
        component: CountdownWidget,
    },
    'pomodoro': {
        slug: 'pomodoro',
        name: 'Focus Timer',
        description: 'Pomodoro technique',
        icon: '🍅',
        category: 'time',
        tags: ['focus', 'health'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: PomodoroWidget,
    },

    // ═══════════════════════════════════════════════════════════════════
    // PRODUCTIVITY
    // ═══════════════════════════════════════════════════════════════════
    'task-manager': {
        slug: 'task-manager',
        name: 'Task Manager',
        description: 'Simple todo list',
        icon: '✅',
        category: 'productivity',
        tags: ['focus'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 2, h: 4 }],
        component: TaskWidget,
    },
    'sticky-notes': {
        slug: 'sticky-notes',
        name: 'Sticky Notes',
        description: 'Quick notes',
        icon: '📝',
        category: 'productivity',
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: StickyNotesWidget,
    },
    'quick-links': {
        slug: 'quick-links',
        name: 'Quick Links',
        description: 'Bookmark shortcuts',
        icon: '🔗',
        category: 'productivity',
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 2, h: 3 }],
        component: QuickLinksWidget,
    },
    'kanban': {
        slug: 'kanban',
        name: 'Kanban Board',
        description: 'Project management',
        icon: '📋',
        category: 'productivity',
        tags: ['focus'],
        tier: 'free',
        defaultSize: { w: 4, h: 4 },
        supportedSizes: [{ w: 4, h: 4 }, { w: 6, h: 4 }],
        component: KanbanWidget,
    },
    'heatmap': {
        slug: 'heatmap',
        name: 'Activity Heatmap',
        description: 'Visualize activity',
        icon: '📊',
        category: 'productivity',
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: HeatmapWidget,
    },
    'ai-assistant': {
        slug: 'ai-assistant',
        name: 'AI Assistant',
        description: 'Chat with AI',
        icon: '🤖',
        category: 'productivity',
        tags: ['focus'],
        tier: 'free',
        defaultSize: { w: 2, h: 4 },
        supportedSizes: [{ w: 2, h: 4 }, { w: 4, h: 4 }],
        component: AiAssistantWidget,
    },
    // Note: Ambiance is now a background-level feature, not a widget
    // See AmbianceContext and AmbianceControls in /components/premium/

    // ═══════════════════════════════════════════════════════════════════
    // LIFESTYLE & WELLNESS
    // ═══════════════════════════════════════════════════════════════════
    'habit-tracker': {
        slug: 'habit-tracker',
        name: 'Habit Tracker',
        description: 'Track streaks',
        icon: '🎯',
        category: 'lifestyle',
        tags: ['health'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 2, h: 4 }],
        component: HabitTrackerWidget,
    },
    'mood-tracker': {
        slug: 'mood-tracker',
        name: 'Mood Tracker',
        description: 'Log your mood',
        icon: '😊',
        category: 'lifestyle',
        tags: ['health'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: MoodTrackerWidget,
    },
    'journal': {
        slug: 'journal',
        name: 'Daily Journal',
        description: 'Write daily thoughts',
        icon: '📔',
        category: 'lifestyle',
        tags: ['focus', 'personal'],
        tier: 'pro',
        defaultSize: { w: 2, h: 3 },
        supportedSizes: [{ w: 2, h: 3 }, { w: 3, h: 4 }],
        component: JournalWidget,
    },
    'creative-prompts': {
        slug: 'creative-prompts',
        name: 'Creative Prompts',
        description: 'Get inspired daily',
        icon: '💡',
        category: 'lifestyle',
        tags: ['creative'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: CreativePromptsWidget,
    },
    'flash-cards': {
        slug: 'flash-cards',
        name: 'Flash Cards',
        description: 'Study & memorize',
        icon: '🎴',
        category: 'productivity',
        tags: ['learning'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: FlashCardsWidget,
    },
    'trakt': {
        slug: 'trakt',
        name: 'Trakt Up Next',
        description: 'Track TV shows',
        icon: '📺',
        category: 'entertainment',
        tags: ['media'],
        tier: 'free',
        defaultSize: { w: 2, h: 3 },
        supportedSizes: [{ w: 2, h: 3 }],
        component: TraktWidget,
    },
    'letterboxd': {
        slug: 'letterboxd',
        name: 'Letterboxd',
        description: 'Recent movie reviews',
        icon: '🎬',
        category: 'entertainment',
        tags: ['media'],
        tier: 'free',
        defaultSize: { w: 2, h: 4 },
        supportedSizes: [{ w: 2, h: 4 }],
        component: LetterboxdWidget,
    },
    'sleep': {
        slug: 'sleep',
        name: 'Sleep Stats',
        description: 'Sleep stages & score',
        icon: '😴',
        category: 'health',
        tags: ['health'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: SleepWidget,
    },
    'fitness-rings': {
        slug: 'fitness-rings',
        name: 'Fitness Rings',
        description: 'Activity progress',
        icon: '🏃',
        category: 'health',
        tags: ['health'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: FitnessRingWidget,
    },
    'social-feed': {
        slug: 'social-feed',
        name: 'Social Feed',
        description: 'Bluesky / Mastodon',
        icon: '💬',
        category: 'social',
        tags: ['social'],
        tier: 'free',
        defaultSize: { w: 2, h: 4 },
        supportedSizes: [{ w: 2, h: 4 }],
        component: SocialFeedWidget,
    },
    'water-tracker': {
        slug: 'water-tracker',
        name: 'Water Intake',
        description: 'Stay hydrated',
        icon: '💧',
        category: 'lifestyle',
        tags: ['health'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: WaterTrackerWidget,
    },
    'breathing': {
        slug: 'breathing',
        name: 'Breathing',
        description: '4-7-8 technique',
        icon: '🧘',
        category: 'lifestyle',
        tags: ['health', 'focus'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: BreathingWidget,
    },
    'age-calculator': {
        slug: 'age-calculator',
        name: 'Age Calculator',
        description: 'Exact age & life progress',
        icon: '🎂',
        category: 'lifestyle',
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: AgeWidget,
    },

    // ═══════════════════════════════════════════════════════════════════
    // TOOLS & UTILITIES
    // ═══════════════════════════════════════════════════════════════════
    'calculator': {
        slug: 'calculator',
        name: 'Calculator',
        description: 'Basic calculator',
        icon: '🔢',
        category: 'tools',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: CalculatorWidget,
    },
    'unit-converter': {
        slug: 'unit-converter',
        name: 'Unit Converter',
        description: 'Length, weight, temp',
        icon: '📏',
        category: 'tools',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: UnitConverterWidget,
    },
    'password-generator': {
        slug: 'password-generator',
        name: 'Password Generator',
        description: 'Secure passwords',
        icon: '🔐',
        category: 'tools',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: PasswordGeneratorWidget,
    },
    'color-palette': {
        slug: 'color-palette',
        name: 'Color Palette',
        description: 'Generate palettes',
        icon: '🎨',
        category: 'tools',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: ColorPaletteWidget,
    },
    'authenticator': {
        slug: 'authenticator',
        name: '2FA Authenticator',
        description: 'TOTP code generator',
        icon: '🔑',
        category: 'tools',
        tags: ['utility'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 2, h: 3 }],
        component: AuthenticatorWidget,
    },

    // ═══════════════════════════════════════════════════════════════════
    // ENTERTAINMENT & GAMES
    // ═══════════════════════════════════════════════════════════════════
    'toybox': {
        slug: 'toybox',
        name: 'Particle Toybox',
        description: 'Interactive particles',
        icon: '✨',
        category: 'entertainment',
        tags: ['fun', 'games'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: ToyboxWidget,
    },
    'dice-roller': {
        slug: 'dice-roller',
        name: 'Dice Roller',
        description: 'Roll virtual dice',
        icon: '🎲',
        category: 'entertainment',
        tags: ['fun', 'games'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: DiceRollerWidget,
    },
    'magic-8-ball': {
        slug: 'magic-8-ball',
        name: 'Magic 8 Ball',
        description: 'Ask the mystic orb',
        icon: '🎱',
        category: 'entertainment',
        tags: ['fun', 'games'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: Magic8BallWidget,
    },
    'coin-flip': {
        slug: 'coin-flip',
        name: 'Coin Flip',
        description: 'Heads or tails',
        icon: '🪙',
        category: 'entertainment',
        tags: ['fun', 'games'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: CoinFlipWidget,
    },
    'tic-tac-toe': {
        slug: 'tic-tac-toe',
        name: 'Tic Tac Toe',
        description: 'Classic X and O',
        icon: '⭕',
        category: 'entertainment',
        tags: ['fun', 'games'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: TicTacToeWidget,
    },

    // ═══════════════════════════════════════════════════════════════════
    // INFORMATION
    // ═══════════════════════════════════════════════════════════════════
    'weather': {
        slug: 'weather',
        name: 'Weather',
        description: 'Local forecast',
        icon: '⛅',
        category: 'information',
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: WeatherWidget,
    },
    'quote': {
        slug: 'quote',
        name: 'Daily Quote',
        description: 'Inspiration',
        icon: '💭',
        category: 'information',
        tier: 'free',
        defaultSize: { w: 2, h: 1 },
        supportedSizes: [{ w: 2, h: 1 }],
        component: QuoteWidget,
    },
    'news-feed': {
        slug: 'news-feed',
        name: 'News Feed',
        description: 'Top headlines',
        icon: '📰',
        category: 'information',
        tags: ['social'],
        tier: 'free',
        defaultSize: { w: 2, h: 3 },
        supportedSizes: [{ w: 2, h: 3 }, { w: 4, h: 3 }],
        component: NewsFeedWidget,
        available: false,
    },
    'stock-ticker': {
        slug: 'stock-ticker',
        name: 'Stock Ticker',
        description: 'Market watch',
        icon: '📈',
        category: 'information',
        tags: ['finance'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: StockTickerWidget,
        available: false,
    },
    'crypto-tracker': {
        slug: 'crypto-tracker',
        name: 'Crypto Tracker',
        description: 'Coin prices',
        icon: '₿',
        category: 'information',
        tags: ['finance'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: CryptoTrackerWidget,
        available: false,
    },

    // ═══════════════════════════════════════════════════════════════════
    // VISUAL & AESTHETIC (NEW)
    // ═══════════════════════════════════════════════════════════════════
    'flip-board': {
        slug: 'flip-board',
        name: 'Retro Flip-Board',
        description: 'Solari-style departure board clock.',
        tier: 'free',
        category: 'time',
        tags: ['aesthetic', 'fun'],
        icon: 'Clock',
        defaultSize: { w: 4, h: 2 },
        supportedSizes: [{ w: 4, h: 2 }, { w: 6, h: 2 }],
        component: FlipBoardWidget,
    },
    'photo-frame': {
        slug: 'photo-frame',
        name: 'Photo Frame',
        description: 'Digital gallery',
        icon: '🖼️',
        category: 'entertainment',
        tags: ['aesthetic', 'media'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 4 }],
        component: PhotoFrameWidget,
    },
    'screensaver': {
        slug: 'screensaver',
        name: 'Screensaver',
        description: 'DVD, Starfield, Matrix effects',
        icon: 'Monitor',
        category: 'entertainment',
        tags: ['aesthetic', 'fun'],
        tier: 'free',
        defaultSize: { w: 4, h: 2 },
        supportedSizes: [{ w: 4, h: 3 }, { w: 6, h: 4 }],
        component: ScreensaverWidget,
    },

    // ═══════════════════════════════════════════════════════════════════
    // SPECIALIZED (NEW)
    // ═══════════════════════════════════════════════════════════════════
    'streamer-tools': {
        slug: 'stream-tools',
        name: 'Streamer Tools',
        description: 'Twitch status & chat',
        icon: 'Twitch',
        category: 'entertainment',
        tags: ['streaming', 'productivity'],
        tier: 'free',
        defaultSize: { w: 4, h: 3 },
        supportedSizes: [{ w: 4, h: 3 }, { w: 6, h: 4 }],
        component: StreamerToolsWidget,
    },
    'qr-code': {
        slug: 'qr-code',
        name: 'QR Code',
        description: 'Share Wi-Fi or Links',
        icon: 'QrCode',
        category: 'productivity',
        tags: ['utility', 'mobile'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: QrCodeWidget,
    },

    // ═══════════════════════════════════════════════════════════════════
    // INTEGRATIONS
    // ═══════════════════════════════════════════════════════════════════
    'spotify': {
        slug: 'spotify',
        name: 'Spotify',
        description: 'Now playing',
        icon: '🎵',
        category: 'integrations',
        tags: ['music'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: SpotifyWidget,
    },
    'github': {
        slug: 'github',
        name: 'GitHub',
        description: 'PRs and Issues',
        icon: '🐙',
        category: 'integrations',
        tags: ['developer'],
        tier: 'free',
        defaultSize: { w: 2, h: 3 },
        supportedSizes: [{ w: 2, h: 3 }, { w: 4, h: 3 }],
        component: GithubWidget,
        available: false,
    },
    'gmail': {
        slug: 'gmail',
        name: 'Gmail',
        description: 'View emails',
        icon: '📧',
        category: 'integrations',
        tags: ['social'],
        tier: 'free',
        defaultSize: { w: 2, h: 3 },
        supportedSizes: [{ w: 2, h: 3 }, { w: 4, h: 3 }],
        component: GmailWidget,
        available: false,
    },
    'google-calendar': {
        slug: 'google-calendar',
        name: 'Google Calendar',
        description: 'Upcoming events',
        icon: '📅',
        category: 'integrations',
        tier: 'free',
        defaultSize: { w: 2, h: 3 },
        supportedSizes: [{ w: 2, h: 3 }, { w: 4, h: 3 }],
        component: GoogleCalendarWidget,
        available: false,
    },
    'obsidian': {
        slug: 'obsidian',
        name: 'Obsidian',
        description: 'Note sync',
        icon: '🗃️',
        category: 'integrations',
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: ObsidianWidget,
        available: false,
    },

    // ═══════════════════════════════════════════════════════════════════
    // MONITORING & SELFHOSTED
    // ═══════════════════════════════════════════════════════════════════
    'system-info': {
        slug: 'system-info',
        name: 'System Info',
        description: 'Battery, network, screen',
        icon: '💻',
        category: 'monitoring',
        tags: ['utility', 'developer'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }],
        component: SystemInfoWidget,
    },
    'grafana': {
        slug: 'grafana',
        name: 'Grafana',
        description: 'Metrics dashboard',
        icon: '📊',
        category: 'monitoring',
        tags: ['selfhosted', 'developer'],
        tier: 'free',
        defaultSize: { w: 4, h: 4 },
        supportedSizes: [{ w: 4, h: 4 }, { w: 6, h: 4 }],
        component: GrafanaWidget,
        available: false,
    },
    'prometheus': {
        slug: 'prometheus',
        name: 'Prometheus',
        description: 'System monitoring',
        icon: '🔥',
        category: 'monitoring',
        tags: ['selfhosted', 'developer'],
        tier: 'free',
        defaultSize: { w: 2, h: 4 },
        supportedSizes: [{ w: 2, h: 4 }, { w: 4, h: 4 }],
        component: PrometheusWidget,
        available: false,
    },
    'jellyfin': {
        slug: 'jellyfin',
        name: 'Jellyfin',
        description: 'Media server',
        icon: '🎬',
        category: 'monitoring',
        tags: ['selfhosted', 'media'],
        tier: 'free',
        defaultSize: { w: 4, h: 4 },
        supportedSizes: [{ w: 4, h: 4 }, { w: 6, h: 4 }],
        component: JellyfinWidget,
        available: false,
    },
    'plex': {
        slug: 'plex',
        name: 'Plex',
        description: 'Media streaming',
        icon: '🎥',
        category: 'monitoring',
        tags: ['selfhosted', 'media'],
        tier: 'free',
        defaultSize: { w: 4, h: 4 },
        supportedSizes: [{ w: 4, h: 4 }, { w: 6, h: 4 }],
        component: PlexWidget,
        available: false,
    },
    'audiobookshelf': {
        slug: 'audiobookshelf',
        name: 'Audiobookshelf',
        description: 'Audiobook player',
        icon: '🎧',
        category: 'monitoring',
        tags: ['selfhosted', 'media'],
        tier: 'free',
        defaultSize: { w: 2, h: 2 },
        supportedSizes: [{ w: 2, h: 2 }, { w: 4, h: 2 }],
        component: AudiobookshelfWidget,
        available: false,
    },
};

// Helper functions
export const getWidgetManifest = (slug: string): WidgetManifest | undefined => {
    return WIDGET_REGISTRY[slug];
};

export const getWidgetsByCategory = (category: WidgetCategory): WidgetManifest[] => {
    return Object.values(WIDGET_REGISTRY).filter(w => w.category === category);
};

export const getAvailableWidgets = (): WidgetManifest[] => {
    return Object.values(WIDGET_REGISTRY).filter(w => w.available !== false);
};

export const getAllCategories = (): WidgetCategory[] => {
    const categories = new Set<WidgetCategory>();
    Object.values(WIDGET_REGISTRY).forEach(w => categories.add(w.category));
    return Array.from(categories);
};
