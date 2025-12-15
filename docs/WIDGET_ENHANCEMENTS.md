# DAEMON Widget Audit & Enhancement Specifications

> **Goal**: Transform all 12 widgets into pro-level components with deep filtering, sorting, and configuration

---

## Widget Categories

### 📋 Productivity (5 widgets)
1. TaskWidget
2. ObsidianWidget
3. KanbanWidget
4. CalendarWidget
5. HeatmapWidget

### 🎨 Lifestyle (4 widgets)
6. HabitTrackerWidget
7. MoodWidget
8. MusicWidget
9. MediaWidget

### 💬 Communication (2 widgets)
10. EmailWidget
11. AIWidget

### 🛠️ Utility (1 widget)
12. ToyBoxWidget

---

## 1. TaskWidget - PRIORITY 1

### Current State
- ✅ Basic task list
- ✅ Add new tasks
- ✅ Toggle completion
- ❌ No filtering
- ❌ No sorting  
- ❌ No priority/due dates
- ❌ No project assignment

### Advanced Features Spec

#### Filters & Views
```typescript
interface TaskFilters {
  status: 'all' | 'todo' | 'in_progress' | 'done';
  priority: 'all' | 'high' | 'medium' | 'low';
  project: string | null; // null = all projects
  dueDate: 'overdue' | 'today' | 'week' | 'month' | 'all';
  assignee: string | 'me' | 'unassigned';
}
```

#### Sort Options
- Due date (asc/desc)
- Priority (high → low, low → high)
- Created date (newest/oldest)
- Alphabetical (A-Z, Z-A)
- Project grouping
- Manual (drag-drop reorder)

#### UI Components
- **Header**: Filter dropdown + Sort dropdown + View toggle (list/grid/grouped)
- **Quick Filters**: Chips for "Today", "Overdue", "High Priority"
- **Search**: Fuzzy search by title/description
- **Context Menu**: Right-click for quick actions (edit, duplicate, delete, move to project)
- **Bulk Actions**: Select multiple → assign priority, move project, mark done

#### Advanced Config
```typescript
interface TaskWidgetConfig {
  defaultView: 'list' | 'grid' | 'grouped';
  defaultSort: SortOption;
  defaultFilters: TaskFilters;
  showCompletedTasks: boolean;
  groupBy: 'none' | 'project' | 'priority' | 'dueDate';
  displayFields: ('priority' | 'dueDate' | 'project' | 'assignee')[];
}
```

---

## 2. KanbanWidget - PRIORITY 1

### Current State
- ❌ Placeholder only
- ❌ No columns
- ❌ No cards
- ❌ No drag-drop

### Advanced Features Spec

#### Core Functionality
- **Columns**: Customizable (To Do, In Progress, Review, Done)
- **Cards**: Drag-drop between columns
- **Swimlanes**: Group by project/epic
- **WIP Limits**: Max cards per column indicator

#### Filters
```typescript
interface KanbanFilters {
  search: string;
  labels: string[];
  assignee: string[];
  priority: ('high' | 'medium' | 'low')[];
  dueThisWeek: boolean;
}
```

#### Card Display Options
- **Compact**: Title only
- **Standard**: Title + assignee + due date
- **Detailed**: Above + description preview + labels + checklist progress

#### Advanced Features
- **Quick Add**: Click column header "+  " to add card
- **Inline Edit**: Double-click title to edit
- **Card Preview**: Hover for full details tooltip
- **Progress**: Checklist completion %  
- **Dependencies**: Link cards with "blocked by" relationships
- **Archived**: View/restore archived cards

---

## 3. CalendarWidget - PRIORITY 2

### Current State
- ❌ Placeholder/basic display
- ❌ No events
- ❌ No integrations

### Advanced Features Spec

#### Views
- **Month**: Traditional calendar grid
- **Week**: 7-day view with time slots
- **Day**: Single day timeline
- **Agenda**: List view of upcoming events

#### Event Types
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  type: 'task' | 'meeting' | 'deadline' | 'reminder' | 'block';
  start: Date;
  end?: Date;
  allDay: boolean;
  color: string;
  project?: string;
  recurrence?: RecurrenceRule;
}
```

#### Filters
- Show/hide event types (tasks, meetings, deadlines)
- Project filter
- Only my events vs all team events
- Work hours only

#### Integrations
- Sync with tasks (show due dates)
- Google Calendar import (read-only)
- Time blocking UI (drag to create blocks)
- Focus time suggestions based on task priorities

---

## 4. HeatmapWidget - PRIORITY 2

### Current State
- ❌ Placeholder
- ❌ No data visualization

### Advanced Features Spec

#### Heatmap Types
```typescript
type HeatmapDataSource =
  | 'task_completions'
  | 'mood_entries'
  | 'habit_tracking'
  | 'work_hours'
  | 'focus_sessions'
  | 'commits' // GitHub integration
  | 'exercise' // Health app integration
```

#### Configuration
- **Time Range**: Last 30/90/180/365 days
- **Color Scheme**: Green (GitHub), Purple (DAEMON), Custom gradient
- **Cell Size**: Compact/Standard/Large
- **Tooltip**: Show count + list of activities on hover
- **Click Action**: Jump to day detail view

#### Stats Panel
- Current streak
- Longest streak
- Total count
- Average per week
- Best day of week
- Most productive month

---

## 5. Obs idianWidget - PRIORITY 3

### Current State
- ✅ Basic vault stats
- ❌ No filtering
- ❌ No recent files

### Advanced Features Spec

#### Vault Overview
- Total notes count
- Word count across vault
- Last synced timestamp
- Sync status indicator

#### Quick Access
- **Recent Notes**: Last 5 edited (with timestamps)
- **Pinned Notes**: Star frequently accessed notes
- **Daily Note**: Quick create/open today's daily note
- **Random Note**: Serendipity discovery

#### Search & Filter
- Full-text search across vault
- Filter by folder/tag
- Sort by modified/created/title
- Show only modified today/this week

#### Stats & Insights
- Notes created this week/month
- Most linked note (backlinks count)
- Orphaned notes (no links)
- Graph view preview (mini network visualization)

---

## 6. EmailWidget - PRIORITY 2

### Current State
- ❌ Placeholder
- ❌ No email integration

### Advanced Features Spec

#### Inbox Summary
- Unread count (badge)
- Priority inbox (important emails first)
- Snooze counts
- Flagged emails

#### Filters & Labels
```typescript
interface EmailFilters {
  folder: 'inbox' | 'sent' | 'drafts' | 'all';
  unreadOnly: boolean;
  flagged: boolean;
  hasAttachments: boolean;
  from: string[]; // Specific senders
  labels: string[];
  timeRange: 'today' | 'week' | 'month' | 'all';
}
```

#### Quick Actions
- Mark as read/unread
- Archive
- Snooze (until tomorrow/next week/custom)
- Quick reply (inline compose)
- Delete

#### Smart Features
- **Priority Detection**: AI-powered importance scoring
- **Summary**: AI-generated email summaries
- **Templates**: Quick reply templates
- **Reminders**: Follow-up reminders for emails needing response

---

## 7. MoodWidget - PRIORITY 3

### Current State
- ✅ Basic mood logging
- ❌ No history
- ❌ No insights

### Advanced Features Spec

#### Mood Logging
- **Quick Log**: 5-emoji scale (😢 → 😄)
- **Detailed**: + energy level, sleep quality, notes
- **Factors**: Tag affecting factors (work, exercise, social, etc.)

#### Visualization
- **Week View**: 7-day mood line chart
- **Month View**: Calendar heatmap
- **Trends**: Compare to last week/month

#### Insights
```typescript
interface MoodInsights {
  averageMood: number; // 1-5
  trend: 'improving' | 'stable' | 'declining';
  bestDay: string; // Day of week
  worstDay: string;
  correlations: {
    factor: string;
    impact: 'positive' | 'negative';
    confidence: number;
  }[];
}
```

#### Export
- CSV download for external analysis
- Share with therapist/coach
- Weekly mood report email

---

## 8. HabitTrackerWidget - PRIORITY 2

### Current State
- ❌Placeholder
- ❌ No habits
- ❌ No tracking

### Advanced Features Spec

#### Habit Management
```typescript
interface Habit {
  id: string;
  name: string;
  frequency: 'daily'  | 'weekly' | 'custom'; // custom: specific days
  targetDays?: number[]; // [0,1,2,3,4] = Mon-Fri
  targetCount: number; // daily goal (e.g., 8 glasses water)
  unit?: string; // 'glasses', 'minutes', 'pages'
  category: 'health' | 'productivity' | 'learning' | 'social';
  reminders: Time[];
}
```

#### Tracking UI
- **Today View**: List of today's habits with checkboxes
- **Quick Add**: "I did X" with count input
- **Streak Display**: 🔥 Streak counter per habit
- **Calendar View**: Monthly grid showing completed days

#### Analytics
- Current streaks (all habits)
- Habit completion rate (%)
- Best performing habit
- Suggested habits based on patterns
- Breakdown by category

#### Gamification
- Streak milestones (7 days, 30 days, 100 days)
- Achievement badges
- Habit chains visualization
- Social accountability (optional sharing)

---

## 9. MusicWidget - PRIORITY 3

### Current State
- ❌ Placeholder
- ❌ No playback

### Advanced Features Spec

#### Integrations
- Spotify API
- Apple Music
- YouTube Music
- Local files (future)

#### Current Playback
- Now playing (track, artist, album art)
- Playback controls (play/pause, skip, volume)
- Progress bar
- Queue preview (next 3 tracks)

#### Quick Actions
- Like/save track
- Add to playlist dropdown
- Share track link
- View lyrics (genius.com integration)

#### Library Access
- Recent tracks
- Saved playlists
- Top artists/tracks this month
- Discover weekly preview

#### Focus Mode Integration
- Auto-play focus playlists when starting work session
- Pomodoro break music
- Bedtime wind-down playlists

---

## 10. MediaWidget - PRIORITY 3

### Current State
- ❌ Placeholder
- ❌ No media library

### Advanced Features Spec

#### Media Sources
- **Jellyfin**: Continue watching shows
- **Audiobookshelf**: Currently listening book + progress
- **Plex**: Recently added movies
- **YouTube**: Watch later   queue

#### Display Options
```typescript
interface MediaConfig {
  sources: ('jellyfin' | 'audiobookshelf' | 'plex' | 'youtube')[];
  view: 'combined' | 'tabs'; // Single list or tabbed by source
  sortBy: 'recent' | 'progress' | 'alphabetical';
  maxItems: number; // 3-10
}
```

#### Card Types
- **TV Shows**: Thumbnail, S0XE0X, continue watching
- **Movies**: Poster, duration remaining, watch status
- **Audiobooks**: Cover, chapter progress, time remaining
- **Videos**: Thumbnail, title, duration

#### Quick Actions
- Continue playing (opens in media app/web player)
- Mark as watched
- Add to queue/playlist
- Remove from list

---

## 11. AIWidget - PRIORITY 1

(Currently implemented in FloatingAI - merge features into widget)

### Enhanced Widget Features

#### Conversation Management
- **History**: Last 10 conversations (summarized)
- **Search**: Find past conversations
- **Pin**: Pin important AI responses
- **Export**: Download conversation as markdown

#### Quick Prompts
```typescript
const quickPrompts = [
  { label: "Summarize my day", icon: "📅", prompt: "Based on my tasks and calendar, summarize my day" },
  { label: "What's urgent?", icon: "🔥", prompt: "What are my most urgent tasks right now?" },
  { label: "Focus suggestion", icon: "🎯", prompt: "What should I focus on next?" },
  { label: "Weekly recap", icon: "📊", prompt: "Give me a recap of this week's progress" }
];
```

#### Context Awareness
- Access to current tasks
- Access to calendar events
- Access to mood history
- Access to vault notes (Obsidian)
- Proactive suggestions based on context

#### Modes
- **Chat**: Normal conversation
- **Command**: Natural language commands (e.g., "Create task: Fix bug in login")
- **Analyze**: Deep dive into patterns and insights
- **Teach**: Ask AI to explain concepts

---

## 12. ToyBoxWidget - PRIORITY 3

### Current State
- ❌ Placeholder
- ❌ No tools

### Advanced Features Spec

#### Quick Tools Collection
```typescript
const tools = [
  { name: "Pomodoro Timer", icon: "⏱️", action: "openPomodoro" },
  { name: "Password Generator", icon: "🔐", action: "openPasswordGen" },
  { name: "Color Picker", icon: "🎨", action: "openColorPicker" },
  { name: "Unit Converter", icon: "📏", action: "openConverter" },
  { name: "Random Quote", icon: "💭", action: "fetchQuote" },
  { name: "Dice Roller", icon: "🎲", action: "rollDice" },
  { name: "QR Code Generator", icon: "📱", action: "openQRGen" },
  { name: "Markdown Preview", icon: "📝", action: "openMarkdown" }
];
```

#### Customization
- User can add/remove tools
- Reorder via drag-drop
- Custom keyboard shortcuts per tool
- Favorite tools (pinned to top)

#### Tool Features
- Modal overlay for complex tools
- Quick result copy-to-clipboard
- Tool usage history
- Suggested tools based on time of day

---

## Global Widget Features

### Configuration Panel (All Widgets)
- **Width**: 1-2x columns (grid span)
- **Height**: Custom height slider
- **Refresh**: Auto-refresh interval
- **Position**: Drag-drop reorder in grid
- **Visibility**: Show/hide per device (mobile/desktop)

### Header Actions (All Widgets)
- ⚙️ **Settings**: Open widget config
- 🔄 **Refresh**: Manual data refresh
- 📌 **Pin**: Keep widget always visible
- ⋮ **More**: Context menu (duplicate, remove, reset)

### Data Management
```typescript
interface WidgetData {
  lastSync: Date;
  cacheExpiry: number; // minutes
  offlineMode: boolean;
  syncStrategy: 'realtime' | 'interval' | 'manual';
}
```

### Accessibility
- Keyboard navigation within widgets
- Screen reader support
- High contrast mode
- Focus indicators
- ARIA labels

---

## Implementation Priority

### Phase 1 - Core Functionality (Week 1-2)
1. ✅ TaskWidget + filters/sorting
2. ✅ KanbanWidget + drag-drop
3. ✅ AIWidget enhancements

### Phase 2 - Data Visualization (Week 3)
4. HeatmapWidget with multiple data sources
5. CalendarWidget with task integration
6. HabitTrackerWidget with streaks

### Phase 3 - Integrations (Week 4)
7. ObsidianWidget search & quick access
8. EmailWidget with Gmail API
9. MediaWidget with Audiobookshelf

### Phase 4 - Polish (Week 5)
10. MoodWidget insights
11. MusicWidget Spotify integration
12. ToyBoxWidget tool collection

---

## Technical Implementation Notes

### State Management
```typescript
// Zustand store for widget data
interface WidgetStore {
  tasks: Task[];
  habits: Habit[];
  moods: MoodEntry[];
  // ... all widget data
  
  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  // ... all actions
  
  // Filters
  taskFilters: TaskFilters;
  setTaskFilters: (filters: TaskFilters) => void;
}
```

### API Design
```typescript
// RESTful endpoints
GET    /api/tasks?status=todo&priority=high&sort=dueDate
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

// Batch operations
POST   /api/tasks/bulk-update
POST   /api/tasks/bulk-delete
```

### Performance
- Virtual scrolling for long lists (react-window)
- Debounced search inputs (300ms)
- Optimistic UI updates
- Background sync with service workers
- IndexedDB for offline support

---

**Created**: 2025-11-29  
**Status**: Specification Complete - Ready for Implementation
