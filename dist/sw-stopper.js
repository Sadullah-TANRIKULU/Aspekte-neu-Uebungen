// sw-stopper.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function clearPWAData() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Alle Caches löschen
        if ('caches' in window) {
            const cacheNames = yield caches.keys();
            yield Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('Alle Caches gelöscht!');
        }
        // 2. Service Worker deregistrieren
        if ('serviceWorker' in navigator) {
            const registrations = yield navigator.serviceWorker.getRegistrations();
            yield Promise.all(registrations.map(reg => reg.unregister()));
            console.log('Alle Service Worker deregistriert!');
        }
        // 3. Seite neu laden, damit alles frisch ist
        window.location.reload();
    });
}
