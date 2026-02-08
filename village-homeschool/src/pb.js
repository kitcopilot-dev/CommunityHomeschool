/**
 * PocketBase Client Singleton
 * Village Homeschool - https://bear-nan.exe.xyz/
 */

// For browser usage without bundler, we'll use the CDN version
// If using a bundler (Vite, etc.), switch to: import PocketBase from 'pocketbase';

const PB_URL = 'https://bear-nan.exe.xyz';

class PocketBaseClient {
    constructor() {
        this.pb = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return this.pb;
        
        // Dynamic import for browser compatibility
        if (typeof window !== 'undefined' && !window.PocketBase) {
            // Load from CDN if not bundled
            await this.loadScript('https://unpkg.com/pocketbase@0.21.1/dist/pocketbase.umd.js');
        }
        
        const PocketBase = window.PocketBase || (await import('pocketbase')).default;
        this.pb = new PocketBase(PB_URL);
        
        // Restore auth from localStorage if present
        const storedAuth = localStorage.getItem('village_pb_auth');
        if (storedAuth) {
            try {
                const parsed = JSON.parse(storedAuth);
                this.pb.authStore.save(parsed.token, parsed.model);
            } catch (e) {
                console.warn('Failed to restore auth:', e);
                localStorage.removeItem('village_pb_auth');
            }
        }

        // Persist auth changes to localStorage
        this.pb.authStore.onChange((token, model) => {
            if (token && model) {
                localStorage.setItem('village_pb_auth', JSON.stringify({ token, model }));
            } else {
                localStorage.removeItem('village_pb_auth');
            }
        });

        this.initialized = true;
        console.log('[PocketBase] Initialized. Auth valid:', this.pb.authStore.isValid);
        return this.pb;
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    get client() {
        if (!this.pb) {
            throw new Error('PocketBase not initialized. Call init() first.');
        }
        return this.pb;
    }

    get isAuthenticated() {
        return this.pb?.authStore?.isValid || false;
    }

    get currentUser() {
        return this.pb?.authStore?.model || null;
    }
}

// Singleton export
const pbClient = new PocketBaseClient();

// Make available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.pbClient = pbClient;
}

export default pbClient;
