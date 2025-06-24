// sw-stopper.ts

export async function clearPWAData(): Promise<void> {
  // 1. Alle Caches löschen
  if ('caches' in window) {
    const cacheNames: string[] = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('Alle Caches gelöscht!');
  }

  // 2. Service Worker deregistrieren
  if ('serviceWorker' in navigator) {
    const registrations: readonly ServiceWorkerRegistration[] = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(reg => reg.unregister()));
    console.log('Alle Service Worker deregistriert!');
  }

  // 3. Seite neu laden, damit alles frisch ist
  window.location.reload();
}

