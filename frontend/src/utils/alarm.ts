// Alarm sound utility for timers
// Uses Web Audio API for reliable, cross-platform sound

let audioContext: AudioContext | null = null;

/**
 * Play a notification/alarm sound
 * Uses Web Audio API to generate a pleasant bell-like tone
 */
export const playAlarm = (volume: number = 0.5) => {
    try {
        // Create audio context on demand (required for browser autoplay policies)
        if (!audioContext) {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        // If context is suspended (autoplay policy), resume it
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const now = audioContext.currentTime;

        // Create oscillator for main tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Bell-like frequency pattern
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.2);

        // Volume envelope (fade in/out for pleasant sound)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(volume * 0.7, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.15);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);

        // Play second beep for emphasis
        setTimeout(() => playBeep(volume * 0.8), 600);
        setTimeout(() => playBeep(volume * 0.6), 1200);

    } catch (e) {
        console.warn('Could not play alarm sound:', e);
        // Fallback: try HTML5 Audio with a base64 beep
        playFallbackBeep();
    }
};

/**
 * Single beep tone
 */
const playBeep = (volume: number = 0.3) => {
    if (!audioContext) return;

    try {
        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(700, now);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
    } catch (e) {
        // Ignore errors for secondary beeps
    }
};

/**
 * Fallback beep using HTML5 Audio
 * Base64-encoded short beep sound
 */
const playFallbackBeep = () => {
    try {
        // Simple beep as base64 WAV
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQIA/4CJ1uzWhnwNAJyz4uy5bDEBDYea3/jUhGEKAIqo5fvWc0AEBpmz7fzPal0IBqS8+P3LaUkNAKjH+fq4PxcFpNL6+qgjB/+l4vz4nxP/mPP+9KQN/5II/+awBP+SFwD2wAr/mB0E8MoP/6MlBurOFP6qKQrl0Rn8ri4I4NQd+a4yCt3WHfitNAna2B31rTYJ19kc8q04CNXaGu+uOgfS2xnsrjwFz9wY6K09As3dFuWsPQDL3hTiq0D+yN8S36tC/MbgENerQ/rE4Q7SqkT4wuIM0KpF9sDjCc6qRvS+5AfMqkfyu+UEyqpI8LjnAsinSeW56QDGp0ritusAxKdL37XtAMKnTduz7wDAplC+s/EAvqZSuLHzAL2mVLSv9QC7plawrfcAuaZYrKv5ALemWqmp+wC1pl2nqP0As6ZfoqYAALGnYZ+kAgCvp2ObogQAradlmKAHAKunZ5WeCgCpp2mSmA0Ap6drj5YQAKWncIyUEwCjp3KJkhYAoadziJAaAJ+ndoWOHQCdp3iDjCAAmah6gIojAJepfH6IKQCWqX98hi8AlKl/eoQzAJOpgXeDOACRqYN1gTsAj6mFc387AI6ph3F9PQCMqYlvez8AiqmLbXlBAIipi2t4QgCHqY1pdkMAhalPZ3REAIOloWVzRQCCpJ5jcUYA');
        audio.volume = 0.3;
        audio.play().catch(() => { });
    } catch (e) {
        // Ignore
    }
};

/**
 * Request notification permission and send a notification
 */
export const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/favicon.ico',
            tag: 'timer-notification',
        });
    }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};
