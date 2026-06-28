const SOUND_KEY = 'dominoSoundEnabled';
const HAPTICS_KEY = 'dominoHapticsEnabled';

const getStoredBoolean = (key: string, defaultValue = true) => {
  if (typeof window === 'undefined') return defaultValue;
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  return value !== 'false';
};

const setStoredBoolean = (key: string, value: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, String(value));
};

export const getSoundEnabled = () => getStoredBoolean(SOUND_KEY, true);
export const setSoundEnabled = (value: boolean) => setStoredBoolean(SOUND_KEY, value);
export const getHapticsEnabled = () => getStoredBoolean(HAPTICS_KEY, true);
export const setHapticsEnabled = (value: boolean) => setStoredBoolean(HAPTICS_KEY, value);
