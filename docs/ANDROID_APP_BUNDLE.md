# Android App Bundle (AAB) Implementation Plan

## Overview

Convert DAEMON from APK to AAB with **Dynamic Feature Modules** to reduce app size and deliver features on-demand.

---

## Current State
- **APK Size**: 14 MB (all features bundled)
- **Download Size**: 14 MB for everyone
- **Install Size**: 14 MB + WebView overhead

## Target State with AAB
- **Base Module**: ~3 MB (core app + Tasks + AI)
- **On-Demand Features**: 1-2 MB each
- **First Install**: 3-5 MB (60% reduction!)
- **Full Install**: Same as before, but optional

---

## Dynamic Feature Modules

### Base Module (Always Installed)
**Size**: ~3 MB

**Includes**:
- Core scaffolding (Navigation, Auth, Settings)
- TaskWidget (essential)
- AIWidget (high-value, small size)
- FloatingAI
- Theme system
- Blob animations

---

### Optional Feature Modules

#### 1. **Email Module** (~1.5 MB)
```gradle
// android/email/build.gradle
android {
    namespace = "run.runfoo.daemon.email"
    dynamicFeatures.add(":email")
}
```

**Includes**:
- EmailWidget
- OAuth integration
- Email sync service

**Download Trigger**:
- User clicks "Add Email Widget" in settings
- Or selects email account in onboarding

---

#### 2. **Calendar Module** (~1 MB)
**Includes**:
- CalendarWidget
- Google Calendar sync
- Event creation UI

**Download Trigger**:
- User enables calendar in widget picker

---

#### 3. **Productivity Suite** (~2 MB)
**Includes**:
- KanbanWidget
- HabitTrackerWidget
- HeatmapWidget
- ObsidianWidget

**Download Trigger**:
- User selects "Productivity" in onboarding
- Or adds any productivity widget

---

#### 4. **Media & Entertainment** (~2.5 MB)
**Includes**:
- MusicWidget
- MediaWidget (Jellyfin/Audiobookshelf)
- MoodWidget

**Download Trigger**:
- User connects Spotify/Jellyfin
- Or adds mood tracking

---

#### 5. **ToyBox & Utilities** (~500 KB)
**Includes**:
- ToyBoxWidget
- Quick utilities (password gen, QR, etc.)

**Download Trigger**:
- User adds ToyBox widget
- Optional/fun features

---

## Implementation Steps

### Step 1: Convert to AAB Build

**Update `android/app/build.gradle`**:
```gradle
android {
    ...
    bundle {
        language {
            enableSplit = true
        }
        density {
            enableSplit = true
        }
        abi {
            enableSplit = true
        }
    }
    
    dynamicFeatures = [
        ":email",
        ":calendar",
        ":productivity",
        ":media",
        ":toybox"
    ]
}
```

**Build AAB instead of APK**:
```bash
cd android
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

---

### Step 2: Create Dynamic Feature Modules

#### Module Structure
```
android/
├── app/ (base module)
├── email/ (dynamic feature)
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/run/runfoo/daemon/email/
│   │   │   └── EmailWidget.kt
│   │   └── res/
│   └── build.gradle
├── calendar/ (dynamic feature)
├── productivity/ (dynamic feature)
├── media/ (dynamic feature)
└── toybox/ (dynamic feature)
```

#### Email Module Example

**`android/email/build.gradle`**:
```gradle
plugins {
    id 'com.android.dynamic-feature'
    id 'kotlin-android'
}

android {
    namespace 'run.runfoo.daemon.email'
    compileSdk 34

    defaultConfig {
        minSdk 24
    }
}

dependencies {
    implementation project(':app')
    implementation 'androidx.core:core-ktx:1.12.0'
}
```

**`android/email/src/main/AndroidManifest.xml`**:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:dist="http://schemas.android.com/apk/distribution">

    <dist:module
        dist:instant="false"
        dist:title="@string/email_module_title">
        <dist:delivery>
            <dist:on-demand />
        </dist:delivery>
        <dist:fusing dist:include="true" />
    </dist:module>

    <application>
        <!-- Email widget and services -->
    </application>
</manifest>
```

---

### Step 3: Install Modules On-Demand

#### In Base App

**`MainActivity.kt`** or React Native bridge:
```kotlin
import com.google.android.play.core.splitinstall.SplitInstallManager
import com.google.android.play.core.splitinstall.SplitInstallManagerFactory
import com.google.android.play.core.splitinstall.SplitInstallRequest
import com.google.android.play.core.splitinstall.SplitInstallStateUpdatedListener

class DynamicFeatureManager(private val context: Context) {
    
    private val splitInstallManager = SplitInstallManagerFactory.create(context)
    
    fun installModule(moduleName: String, callback: (Boolean) -> Unit) {
        // Check if already installed
        if (splitInstallManager.installedModules.contains(moduleName)) {
            callback(true)
            return
        }
        
        val request = SplitInstallRequest.newBuilder()
            .addModule(moduleName)
            .build()
        
        splitInstallManager.startInstall(request)
            .addOnSuccessListener { sessionId ->
                // Monitor progress
                val listener = SplitInstallStateUpdatedListener { state ->
                    when (state.status()) {
                        SplitInstallSessionStatus.INSTALLED -> {
                            callback(true)
                        }
                        SplitInstallSessionStatus.FAILED -> {
                            callback(false)
                        }
                    }
                }
                splitInstallManager.registerListener(listener)
            }
            .addOnFailureListener { exception ->
                callback(false)
            }
    }
    
    fun isModuleInstalled(moduleName: String): Boolean {
        return splitInstallManager.installedModules.contains(moduleName)
    }
    
    fun uninstallModule(moduleName: String) {
        splitInstallManager.deferredUninstall(listOf(moduleName))
    }
}
```

---

### Step 4: React Native Bridge

**`DynamicFeatureModule.kt`**:
```kotlin
@ReactModule(name = "DynamicFeature")
class DynamicFeatureModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    private val featureManager = DynamicFeatureManager(reactContext)
    
    @ReactMethod
    fun installFeature(moduleName: String, promise: Promise) {
        featureManager.installModule(moduleName) { success ->
            if (success) {
                promise.resolve(true)
            } else {
                promise.reject("INSTALL_FAILED", "Failed to install $moduleName")
            }
        }
    }
    
    @ReactMethod
    fun isFeatureInstalled(moduleName: String, promise: Promise) {
        val installed = featureManager.isModuleInstalled(moduleName)
        promise.resolve(installed)
    }
    
    @ReactMethod
    fun uninstallFeature(moduleName: String, promise: Promise) {
        featureManager.uninstallModule(moduleName)
        promise.resolve(true)
    }
}
```

---

### Step 5: Frontend Integration

**`src/services/DynamicFeatures.ts`**:
```typescript
import { NativeModules } from 'react-native';

const { DynamicFeature } = NativeModules;

export class FeatureManager {
  async installFeature(featureName: string): Promise<boolean> {
    try {
      await DynamicFeature.installFeature(featureName);
      return true;
    } catch (error) {
      console.error(`Failed to install ${featureName}:`, error);
      return false;
    }
  }

  async isFeatureInstalled(featureName: string): Promise<boolean> {
    try {
      return await DynamicFeature.isFeatureInstalled(featureName);
    } catch {
      return false;
    }
  }

  async uninstallFeature(featureName: string): Promise<void> {
    await DynamicFeature.uninstallFeature(featureName);
  }
}

export const featureManager = new FeatureManager();
```

**Widget Picker with Module Installation**:
```tsx
import { featureManager } from './services/DynamicFeatures';

const WidgetPicker = () => {
  const [installing, setInstalling] = useState<string | null>(null);

  const handleAddWidget = async (widgetType: string) => {
    const moduleMap = {
      'email': 'email',
      'calendar': 'calendar',
      'kanban': 'productivity',
      'habits': 'productivity',
      'music': 'media',
      'jellyfin': 'media'
    };

    const moduleName = moduleMap[widgetType];
    
    if (moduleName) {
      const installed = await featureManager.isFeatureInstalled(moduleName);
      
      if (!installed) {
        setInstalling(moduleName);
        const success = await featureManager.installFeature(moduleName);
        setInstalling(null);
        
        if (!success) {
          alert('Failed to download module. Please check your connection.');
          return;
        }
      }
    }

    // Add widget to layout
    addWidgetToGrid(widgetType);
  };

  return (
    <div className="widget-picker">
      {widgets.map(widget => (
        <div key={widget.id} onClick={() => handleAddWidget(widget.id)}>
          <img src={widget.icon} />
          <h3>{widget.name}</h3>
          {installing === widget.module && <Spinner />}
        </div>
      ))}
    </div>
  );
};
```

---

## Size Breakdown

### Before (APK)
| Component | Size |
|-----------|------|
| Total | 14 MB |

### After (AAB - Base Only)
| Component | Size |
|-----------|------|
| Base App | 3 MB |
| On first install | **3 MB** |

### After (AAB - Full Install)
| Module | Size | Cumulative |
|--------|------|------------|
| Base | 3 MB | 3 MB |
| Email | 1.5 MB | 4.5 MB |
| Calendar | 1 MB | 5.5 MB |
| Productivity | 2 MB | 7.5 MB |
| Media | 2.5 MB | 10 MB |
| ToyBox | 0.5 MB | 10.5 MB |
| **Total** | **10.5 MB** | **25% smaller!** |

**Why smaller?**
- Google Play only delivers resources for user's device (screen density, CPU arch)
- No unused translations
- No unused assets

---

## User Experience

### Onboarding Flow
1. **Install base app** (3 MB) - Tasks + AI only
2. **Feature selection screen**:
   - "I want email integration" → Downloads email module
   - "I track habits" → Downloads productivity module
   - "I listen to music" → Downloads media module
3. **Progressive enhancement** - Add more features anytime from settings

### Settings Panel
```tsx
<SettingsSection title="Manage Features">
  <FeatureRow
    name="Email & Calendar"
    size="2.5 MB"
    installed={emailInstalled}
    onToggle={toggleEmailModule}
  />
  <FeatureRow
    name="Productivity Suite"
    size="2 MB"
    installed={productivityInstalled}
    onToggle={toggleProductivityModule}
  />
  <FeatureRow
    name="Media & Mood"
    size="2.5 MB"
    installed={mediaInstalled}
    onToggle={toggleMediaModule}
  />
</SettingsSection>
```

---

## Testing

### Test AAB Locally
```bash
# Build AAB
cd android
./gradlew bundleDebug

# Extract APKs for testing
bundletool build-apks \
  --bundle=app/build/outputs/bundle/debug/app-debug.aab \
  --output=daemon.apks \
  --mode=universal

# Install
bundletool install-apks --apks=daemon.apks
```

### Test Dynamic Features
```bash
# Build with specific module
./gradlew :email:bundleDebug

# Install just the email module
bundletool install-apks --apks=daemon.apks --modules=email
```

---

## Deployment

### Upload to Google Play Console
1. Build AAB: `./gradlew bundleRelease`
2. Upload `app-release.aab` to Play Console
3. Google Play automatically generates optimized APKs for each device
4. Users download only what they need

### Internal Testing Track
- Test all module combinations
- Verify installation flows
- Check size reductions per device

---

## Monitoring

### Track Module Installations
```kotlin
// Analytics
fun trackModuleInstall(moduleName: String, success: Boolean) {
    analytics.logEvent("module_install") {
        param("module_name", moduleName)
        param("success", success)
        param("user_id", getCurrentUserId())
    }
}
```

### Benefits Metrics
- **Download size savings** per user
- **Install completion rate** per module
- **Feature adoption** (which modules are popular)

---

## Future Enhancements

### Conditional Delivery
Only deliver modules based on user attributes:
```xml
<dist:module>
    <dist:delivery>
        <dist:install-time>
            <dist:conditions>
                <dist:user-countries dist:include="true">
                    <dist:country dist:code="US" />
                    <dist:country dist:code="GB" />
                </dist:user-countries>
            </dist:conditions>
        </dist:install-time>
    </dist:delivery>
</dist:module>
```

### Asset Packs
For large media (backgrounds, sounds):
```xml
<dist:asset-pack
    android:name="backgrounds"
    split="backgrounds">
    <dist:delivery>
        <dist:install-time />
    </dist:delivery>
</dist:asset-pack>
```

---

## Implementation Timeline

### Week 1: Setup
- [x] Convert build to AAB
- [ ] Create base module structure
- [ ] Define module boundaries

### Week 2: Module Creation
- [ ] Create email dynamic feature
- [ ] Create calendar dynamic feature
- [ ] Create productivity dynamic feature

### Week 3: Integration
- [ ] React Native bridge for module management
- [ ] Widget picker UI with installation
- [ ] Settings panel for manage features

### Week 4: Testing & Polish
- [ ] Test all module combinations
- [ ] Optimize module sizes
- [ ] Internal testing track deployment

---

## Rollback Plan

If AAB causes issues:
1. Keep APK build script: `./gradlew assembleRelease`
2. Upload APK to Play Console as fallback
3. Can switch between AAB and APK anytime

---

**Benefits Summary**:
- ✅ **60-70% smaller** initial download
- ✅ **Faster installs** (3 MB vs 14 MB)
- ✅ **Better retention** (users more likely to complete install)
- ✅ **Modular codebase** (easier to maintain)
- ✅ **User choice** (install only what you need)

**Next Step**: Start with base module restructuring?

**Created**: 2025-11-29  
**Status**: Ready for Implementation
