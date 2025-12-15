package xyz.ersen.app;

import com.getcapacitor.BridgeActivity;

import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ProFeaturesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
