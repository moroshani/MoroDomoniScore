let audioContext: AudioContext | null = null;
let clackAudio: HTMLAudioElement | null = null;

const createNoiseBuffer = (durationMs: number) => {
  const context = audioContext || new AudioContext();
  audioContext = context;
  const length = Math.floor(context.sampleRate * (durationMs / 1000));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const fade = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * fade * fade;
  }
  return buffer;
};

const playSynthClack = () => {
  const context = audioContext || new AudioContext();
  audioContext = context;
  if (context.state === 'suspended') {
    context.resume();
  }
  const bufferSource = context.createBufferSource();
  bufferSource.buffer = createNoiseBuffer(90);

  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.4, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.09);

  bufferSource.connect(filter).connect(gain).connect(context.destination);
  bufferSource.start();
};

export const playClack = (enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  if (!clackAudio) {
    clackAudio = new Audio('/sounds/domino-clack.mp3');
    clackAudio.preload = 'auto';
  }
  clackAudio.currentTime = 0;
  clackAudio.play().catch(() => {
    try {
      playSynthClack();
    } catch (error) {
      console.warn('Audio feedback failed.', error);
    }
  });
};

export const triggerHaptic = (enabled: boolean, durationMs = 10) => {
  if (!enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(durationMs);
  } catch (error) {
    console.warn('Haptic feedback failed.', error);
  }
};
