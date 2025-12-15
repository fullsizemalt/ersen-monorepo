import { registerPlugin } from '@capacitor/core';

export interface ProFeaturesPlugin {
    isInstalled(): Promise<{ installed: boolean }>;
    install(): Promise<{ status: string }>;
}

const ProFeatures = registerPlugin<ProFeaturesPlugin>('ProFeatures');

export default ProFeatures;
