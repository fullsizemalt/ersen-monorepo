# DAEMON Android Native Features Specification

## Overview

Transform DAEMON into a system-level productivity interface with deep Android integration: power menu, quick settings, widgets, background service, and floating bubble.

---

## 1. Power Menu Integration

### Power Menu Tile (Long-press Power Button)

**Location**: `android/app/src/main/java/com/daemon/app/PowerMenuTile.kt`

```kotlin
import android.service.controls.Control
import android.service.controls.ControlsProviderService
import android.service.controls.actions.ControlAction

class DaemonPowerMenuService : ControlsProviderService() {
    
    override fun createPublisherForAllAvailable(): Flow<Control> {
        return flowOf(
            Control.StatelessBuilder("quick-task", pendingIntent)
                .setTitle("Quick Task")
                .setSubtitle("Add task to DAEMON")
                .setDeviceType(DeviceTypes.TYPE_GENERIC_ON_OFF)
                .build(),
                
            Control.StatelessBuilder("ai-assist", pendingIntent)
                .setTitle("AI Assistant")
                .setSubtitle("Voice or text input")
                .setDeviceType(DeviceTypes.TYPE_GENERIC_ON_OFF)
                .build(),
                
            Control.StatelessBuilder("focus-mode", pendingIntent)
                .setTitle("Focus Mode")
                .setSubtitle("Start Pomodoro")
                .setDeviceType(DeviceTypes.TYPE_GENERIC_ON_OFF)
                .build()
        )
    }
}
```

**Manifest Entry**:
```xml
<service
    android:name=".PowerMenuTile"
    android:label="DAEMON"
    android:permission="android.permission.BIND_CONTROLS"
    android:exported="true">
    <intent-filter>
        <action android:name="android.service.controls.ControlsProviderService" />
    </intent-filter>
</service>
```

---

## 2. Quick Settings Tile

### Swipe-Down Notification Shade

**Location**: `android/app/src/main/java/com/daemon/app/QuickTile.kt`

```kotlin
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService

class DaemonQuickTile : TileService() {
    
    override fun onClick() {
        // Open floating overlay
        val intent = Intent(this, FloatingBubbleService::class.java)
        startService(intent)
        
        // Or open mini dialog
        showDialog(QuickTaskDialog())
    }
    
    override fun onStartListening() {
        qsTile?.let { tile ->
            // Update tile based on state
            val tasksToday = getUncompletedTasksCount()
            
            tile.label = "DAEMON"
            tile.subtitle = "$tasksToday tasks"
            tile.state = if (isFocusModeActive()) Tile.STATE_ACTIVE else Tile.STATE_INACTIVE
            tile.updateTile()
        }
    }
}
```

**Manifest**:
```xml
<service
    android:name=".QuickTile"
    android:icon="@drawable/daemon_logo"
    android:label="DAEMON"
    android:permission="android.permission.BIND_QUICK_SETTINGS_TILE"
    android:exported="true">
    <intent-filter>
        <action android:name="android.service.quicksettings.TileService" />
    </intent-filter>
    <meta-data
        android:name="android.service.quicksettings.ACTIVE_TILE"
        android:value="true" />
</service>
```

---

## 3. Home Screen Widgets

### Widget Collection

#### 3.1 Task List Widget (4x2)

**Features**:
- Shows today's tasks (scrollable)
- Tap to check off
- Bottom button: "Add Task"
- Updates every 15 minutes

```kotlin
class TaskListWidget : AppWidgetProvider() {
    
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_task_list)
            
            // Set up list view
            val intent = Intent(context, TaskListWidgetService::class.java)
            views.setRemoteAdapter(R.id.task_list, intent)
            
            // Add task button
            val addIntent = PendingIntent.getActivity(context, 0, 
                Intent(context, QuickTaskActivity::class.java), 
                PendingIntent.FLAG_UPDATE_CURRENT)
            views.setOnClickPendingIntent(R.id.add_button, addIntent)
            
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
```

**Layout** (`res/layout/widget_task_list.xml`):
```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/widget_background"
    android:padding="16dp">
    
    <TextView
        android:text="Today"
        android:textSize="18sp"
        android:fontFamily="@font/space_grotesk_bold" />
    
    <ListView
        android:id="@+id/task_list"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1" />
    
    <Button
        android:id="@+id/add_button"
        android:text="+ Add Task"
        android:background="@drawable/button_gradient" />
</LinearLayout>
```

#### 3.2 AI Quick Input Widget (2x1)

- Microphone icon (styled with DAEMON logo)
- Tap to voice input
- Processes with AI: "Add task: call mom" → creates task
- Shows last action timestamp

#### 3.3 Pomodoro Timer Widget (2x2)

- Circular progress indicator
- Start/Stop button
- Current session count
- Animated blobs in background (subtle)

#### 3.4 Stats Widget (2x2)

- Tasks completed today: **8/12**
- Current streak: **5 days** 🔥
- Mood: 😊 (tap to log)
- Mini heatmap (last 7 days)

#### 3.5 Minimal Clock Widget (4x1)

- Time + Date
- Below: "3 tasks" or "Focus Mode active"
- Tapping opens DAEMON

---

## 4. Background Service

### Always-Running Productivity Service

**Location**: `android/app/src/main/java/com/daemon/app/BackgroundService.kt`

```kotlin
class DaemonService : Service() {
    
    private lateinit var notificationManager: NotificationManager
    private lateinit var aiAssistant: AIAssistant
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Create foreground notification
        val notification = createForegroundNotification()
        startForeground(NOTIFICATION_ID, notification)
        
        // Start background tasks
        startDataSync()
        startSmartReminders()
        startContextMonitoring()
        
        return START_STICKY // Restart if killed
    }
    
    private fun startDataSync() {
        // Sync tasks every 5 minutes
        Timer().scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                syncWithServer()
                updateWidgets()
            }
        }, 0, 5 * 60 * 1000)
    }
    
    private fun startSmartReminders() {
        // Location-based: "You're near gym, time for workout?"
        // Time-based: "Afternoon energy dip, coffee break?"
        // Context-based: "Still no progress on high-priority task X"
    }
    
    private fun startContextMonitoring() {
        // Detect:
        // - Phone connects to car Bluetooth → show commute playlist
        // - Arrive at office → switch to work focus mode
        // - Evening → remind to log mood
    }
    
    private fun createForegroundNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("DAEMON")
            .setContentText("Productivity assistant active")
            .setSmallIcon(R.drawable.daemon_logo_mono)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW) // Don't be annoying
            .build()
    }
}
```

**Permissions**:
```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

---

## 5. Floating Bubble (Chat Heads Style)

### Overlay Bubble Interface

**Location**: `android/app/src/main/java/com/daemon/app/FloatingBubble.kt`

```kotlin
class FloatingBubbleService : Service() {
    
    private lateinit var windowManager: WindowManager
    private lateinit var bubbleView: View
    private var isExpanded = false
    
    override fun onCreate() {
        super.onCreate()
        
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        
        // Create bubble view
        bubbleView = LayoutInflater.from(this).inflate(R.layout.floating_bubble, null)
        
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        
        params.gravity = Gravity.TOP or Gravity.START
        params.x = 100
        params.y = 100
        
        windowManager.addView(bubbleView, params)
        
        setupBubbleInteraction()
    }
    
    private fun setupBubbleInteraction() {
        val bubble = bubbleView.findViewById<ImageView>(R.id.bubble_icon)
        val expandedView = bubbleView.findViewById<LinearLayout>(R.id.expanded_panel)
        
        // Drag to move
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f
        
        bubble.setOnTouchListener { v, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    params.x = initialX + (event.rawX - initialTouchX).toInt()
                    params.y = initialY + (event.rawY - initialTouchY).toInt()
                    windowManager.updateViewLayout(bubbleView, params)
                    true
                }
                MotionEvent.ACTION_UP -> {
                    // Snap to edge
                    if (params.x < screenWidth / 2) {
                        params.x = 0
                    } else {
                        params.x = screenWidth - bubble.width
                    }
                    windowManager.updateViewLayout(bubbleView, params)
                    
                    // If didn't move much, toggle expand
                    if (Math.abs(event.rawX - initialTouchX) < 10) {
                        toggleExpanded()
                    }
                    true
                }
                else -> false
            }
        }
    }
    
    private fun toggleExpanded() {
        val expandedView = bubbleView.findViewById<LinearLayout>(R.id.expanded_panel)
        
        if (isExpanded) {
            // Collapse
            expandedView.animate()
                .scaleX(0f)
                .scaleY(0f)
                .alpha(0f)
                .setDuration(200)
                .start()
        } else {
            // Expand
            expandedView.visibility = View.VISIBLE
            expandedView.animate()
                .scaleX(1f)
                .scaleY(1f)
                .alpha(1f)
                .setDuration(200)
                .start()
        }
        
        isExpanded = !isExpanded
    }
}
```

**Bubble UI** (`res/layout/floating_bubble.xml`):
```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content">
    
    <!-- Collapsed Bubble -->
    <ImageView
        android:id="@+id/bubble_icon"
        android:layout_width="64dp"
        android:layout_height="64dp"
        android:src="@drawable/daemon_logo"
        android:background="@drawable/bubble_background"
        android:elevation="8dp" />
    
    <!-- Expanded Panel -->
    <LinearLayout
        android:id="@+id/expanded_panel"
        android:layout_width="280dp"
        android:layout_height="wrap_content"
        android:background="@drawable/expanded_panel_bg"
        android:padding="16dp"
        android:orientation="vertical"
        android:visibility="gone"
        android:elevation="8dp">
        
        <!-- Quick Actions -->
        <TextView
            android:text="Quick Actions"
            android:textSize="16sp"
            android:fontFamily="@font/space_grotesk_bold" />
        
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_marginTop="12dp">
            
            <ImageButton
                android:id="@+id/btn_add_task"
                android:src="@drawable/ic_add_task"
                android:contentDescription="Add Task" />
            
            <ImageButton
                android:id="@+id/btn_ai_voice"
                android:src="@drawable/ic_microphone"
                android:contentDescription="Voice Input" />
            
            <ImageButton
                android:id="@+id/btn_focus"
                android:src="@drawable/ic_timer"
                android:contentDescription="Focus Mode" />
        </LinearLayout>
        
        <!-- Today's Tasks (Mini List) -->
        <TextView
            android:text="Today"
            android:textSize="14sp"
            android:layout_marginTop="16dp" />
        
        <ListView
            android:id="@+id/mini_task_list"
            android:layout_width="match_parent"
            android:layout_height="120dp" />
        
        <!-- Close Button -->
        <Button
            android:id="@+id/btn_close"
            android:text="Close"
            android:layout_marginTop="8dp" />
    </LinearLayout>
</FrameLayout>
```

**Bubble Background** (`res/drawable/bubble_background.xml`):
```xml
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <gradient
        android:startColor="#6C5CE7"
        android:endColor="#C44EFF"
        android:angle="135" />
    <size
        android:width="64dp"
        android:height="64dp" />
</shape>
```

**Permission**:
```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
```

User must grant "Display over other apps" permission (request on first launch).

---

## 6. Notification Enhancements

### Smart Notifications

```kotlin
class SmartNotificationManager {
    
    fun sendTaskReminder(task: Task) {
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.daemon_logo_mono)
            .setLargeIcon(generateTaskIcon(task))
            .setContentTitle(task.title)
            .setContentText("Due in 30 minutes")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .addAction(R.drawable.ic_check, "Mark Done", markDonePendingIntent)
            .addAction(R.drawable.ic_snooze, "Snooze", snoozePendingIntent)
            .setStyle(NotificationCompat.BigTextStyle()
                .bigText("${task.title}\n\nProject: ${task.project}\nPriority: ${task.priority}"))
            .build()
        
        notificationManager.notify(task.id, notification)
    }
    
    fun sendDailyDigest() {
        // Morning: "Good morning! You have 5 tasks today"
        // Evening: "Great work! 7/8 tasks completed"
    }
    
    fun sendStreakCelebration() {
        // "🔥 5 day streak! Keep it up!"
    }
}
```

---

## Implementation Priority

### Phase 1 - Foundation (Week 1)
- [x] Quick Settings Tile (easiest, highest impact)
- [ ] Task List Widget (4x2)
- [ ] Background Service skeleton

### Phase 2 - Rich Widgets (Week 2)
- [ ] AI Quick Input Widget (2x1)
- [ ] Pomodoro Widget (2x2)
- [ ] Stats Widget (2x2)

### Phase 3 - Advanced (Week 3)
- [ ] Floating Bubble
- [ ] Power Menu Integration
- [ ] Smart Notifications

### Phase 4 - Polish (Week 4)
- [ ] Widget customization (colors, density)
- [ ] Battery optimization
- [ ] Context-aware automation

---

## Battery Considerations

### Optimization Strategies

1. **WorkManager** instead of constant polling
2. **Doze Mode** exemption for critical features
3. **Battery saver detection** - reduce sync frequency
4. **Adaptive sync** - more frequent when user active

```kotlin
class BatteryOptimizer {
    
    fun adjustSyncFrequency() {
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        
        val frequency = when {
            powerManager.isPowerSaveMode -> 30 * 60 * 1000 // 30 min
            powerManager.isDeviceIdleMode -> 60 * 60 * 1000 // 1 hour
            else -> 5 * 60 * 1000 // 5 min
        }
        
        scheduleSync(frequency)
    }
}
```

---

## Design Assets Needed

### Widget Backgrounds
- Light mode: White with subtle shadow
- Dark mode: Dark gray glassmorphic
- Adaptive corners (rounded)

### Icons
- Monochrome logo for notification
- Colored logo for bubble/widgets
- Action icons: add task, timer, voice, etc.

### Animations
- Bubble expand/collapse
- Widget data refresh shimmer
- Task completion checkmark

---

**Created**: 2025-11-29  
**Status**: Specification Complete - Ready for Android Implementation  
**Estimated Effort**: 3-4 weeks for full feature set
