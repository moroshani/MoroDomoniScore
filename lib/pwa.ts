export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.info('Service worker registered successfully.');
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
};
