/**
 * Auth Module for Village Homeschool
 * Wraps PocketBase authentication
 */

import pbClient from './pb.js';

const auth = {
    /**
     * Initialize the auth system (must be called on page load)
     */
    async init() {
        await pbClient.init();
        return this.isAuthenticated();
    },

    /**
     * Register a new user
     * @param {string} email 
     * @param {string} password 
     * @param {string} passwordConfirm 
     * @param {string} familyName 
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async register(email, password, passwordConfirm, familyName) {
        try {
            const pb = pbClient.client;
            
            // Create the user account
            const userData = {
                email,
                password,
                passwordConfirm,
                name: familyName
            };

            const user = await pb.collection('users').create(userData);

            // Auto-login after registration
            await pb.collection('users').authWithPassword(email, password);

            // Create their profile record if profiles collection exists
            try {
                await pb.collection('profiles').create({
                    user: user.id,
                    family_name: familyName,
                    description: '',
                    location: '',
                    children_ages: ''
                });
            } catch (profileErr) {
                console.warn('Profile creation skipped (may not exist):', profileErr.message);
            }

            return { success: true, user: pb.authStore.model };
        } catch (err) {
            console.error('Registration error:', err);
            return { 
                success: false, 
                error: err.response?.message || err.message || 'Registration failed'
            };
        }
    },

    /**
     * Login with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async login(email, password) {
        try {
            const pb = pbClient.client;
            const authData = await pb.collection('users').authWithPassword(email, password);
            return { success: true, user: authData.record };
        } catch (err) {
            console.error('Login error:', err);
            return { 
                success: false, 
                error: err.response?.message || err.message || 'Invalid credentials'
            };
        }
    },

    /**
     * Logout the current user
     */
    logout() {
        pbClient.client.authStore.clear();
        localStorage.removeItem('village_pb_auth');
    },

    /**
     * Check if user is currently authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return pbClient.isAuthenticated;
    },

    /**
     * Get the current user object
     * @returns {object|null}
     */
    getCurrentUser() {
        return pbClient.currentUser;
    },

    /**
     * Get the user's profile (from profiles collection)
     * @returns {Promise<object|null>}
     */
    async getProfile() {
        if (!this.isAuthenticated()) return null;
        
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model.id;
            const profiles = await pb.collection('profiles').getList(1, 1, {
                filter: `user = "${userId}"`
            });
            return profiles.items[0] || null;
        } catch (err) {
            console.warn('Profile fetch error:', err);
            return null;
        }
    },

    /**
     * Update the user's profile
     * @param {object} data - { family_name, description, location, children_ages }
     * @returns {Promise<{success: boolean, profile?: object, error?: string}>}
     */
    async updateProfile(data) {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const pb = pbClient.client;
            const profile = await this.getProfile();
            
            if (profile) {
                const updated = await pb.collection('profiles').update(profile.id, data);
                return { success: true, profile: updated };
            } else {
                // Create profile if it doesn't exist
                const userId = pb.authStore.model.id;
                const created = await pb.collection('profiles').create({
                    user: userId,
                    ...data
                });
                return { success: true, profile: created };
            }
        } catch (err) {
            console.error('Profile update error:', err);
            return { success: false, error: err.message };
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.villageAuth = auth;
}

export default auth;
