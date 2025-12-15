package xyz.ersen.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.splitinstall.SplitInstallManager;
import com.google.android.play.core.splitinstall.SplitInstallManagerFactory;
import com.google.android.play.core.splitinstall.SplitInstallRequest;
import com.google.android.play.core.splitinstall.SplitInstallStateUpdatedListener;
import com.google.android.play.core.splitinstall.model.SplitInstallSessionStatus;

@CapacitorPlugin(name = "ProFeatures")
public class ProFeaturesPlugin extends Plugin {

    private SplitInstallManager splitInstallManager;
    private int mySessionId = 0;

    @Override
    public void load() {
        splitInstallManager = SplitInstallManagerFactory.create(getContext());
    }

    @PluginMethod
    public void isInstalled(PluginCall call) {
        boolean installed = splitInstallManager.getInstalledModules().contains("pro_features");
        JSObject ret = new JSObject();
        ret.put("installed", installed);
        call.resolve(ret);
    }

    @PluginMethod
    public void install(PluginCall call) {
        if (splitInstallManager.getInstalledModules().contains("pro_features")) {
            JSObject ret = new JSObject();
            ret.put("status", "already_installed");
            call.resolve(ret);
            return;
        }

        SplitInstallRequest request = SplitInstallRequest.newBuilder()
                .addModule("pro_features")
                .build();

        SplitInstallStateUpdatedListener listener = state -> {
            if (state.sessionId() == mySessionId) {
                JSObject ret = new JSObject();
                switch (state.status()) {
                    case SplitInstallSessionStatus.DOWNLOADING:
                        // You could emit events here for progress
                        break;
                    case SplitInstallSessionStatus.INSTALLED:
                        ret.put("status", "installed");
                        call.resolve(ret);
                        break;
                    case SplitInstallSessionStatus.FAILED:
                        call.reject("Installation failed with error code: " + state.errorCode());
                        break;
                }
            }
        };

        splitInstallManager.registerListener(listener);

        splitInstallManager.startInstall(request)
                .addOnSuccessListener(sessionId -> {
                    mySessionId = sessionId;
                })
                .addOnFailureListener(exception -> {
                    call.reject("Failed to start installation", exception);
                });
    }
}
