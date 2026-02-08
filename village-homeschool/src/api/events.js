/**
 * Events API Module
 * CRUD operations for community events in PocketBase
 */

import pbClient from './pb.js';

const eventsApi = {
    /**
     * Get all upcoming events
     * @param {object} filters - { search, ageGroup, limit }
     * @returns {Promise<Array>}
     */
    async getAll(filters = {}) {
        try {
            const pb = pbClient.client;
            const today = new Date().toISOString().split('T')[0];
            
            let filterParts = [`event_date >= "${today}"`];
            
            if (filters.ageGroup) {
                filterParts.push(`age_suitability = "${filters.ageGroup}"`);
            }
            
            if (filters.search) {
                filterParts.push(`(title ~ "${filters.search}" || description ~ "${filters.search}")`);
            }

            const records = await pb.collection('events').getList(1, filters.limit || 50, {
                filter: filterParts.join(' && '),
                sort: 'event_date',
                expand: 'creator'
            });
            return records.items;
        } catch (err) {
            console.error('Failed to fetch events:', err);
            return [];
        }
    },

    /**
     * Get a single event by ID
     * @param {string} id 
     * @returns {Promise<object|null>}
     */
    async getById(id) {
        try {
            const pb = pbClient.client;
            return await pb.collection('events').getOne(id, {
                expand: 'creator'
            });
        } catch (err) {
            console.error('Failed to fetch event:', err);
            return null;
        }
    },

    /**
     * Get events created by the current user
     * @returns {Promise<Array>}
     */
    async getMyEvents() {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) return [];

            const records = await pb.collection('events').getFullList({
                filter: `creator = "${userId}"`,
                sort: '-date'
            });
            return records;
        } catch (err) {
            console.error('Failed to fetch my events:', err);
            return [];
        }
    },

    /**
     * Create a new event
     * @param {object} data - { title, description, date, time, location, age_suitability, max_capacity, supplies }
     * @returns {Promise<{success: boolean, event?: object, error?: string}>}
     */
    async create(data) {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) throw new Error('Not authenticated');

            const event = await pb.collection('events').create({
                creator: userId,
                title: data.title,
                description: data.description || '',
                event_date: data.date || data.event_date,
                event_time: data.time || data.event_time || '',
                location: data.location || '',
                age_suitability: data.age_suitability || 'All Ages',
                max_capacity: parseInt(data.max_capacity) || 0,
                latitude: data.latitude || null,
                longitude: data.longitude || null
            });
            return { success: true, event };
        } catch (err) {
            console.error('Failed to create event:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Update an existing event
     * @param {string} id 
     * @param {object} data 
     * @returns {Promise<{success: boolean, event?: object, error?: string}>}
     */
    async update(id, data) {
        try {
            const pb = pbClient.client;
            
            // Map date/time to event_date/event_time if present
            if (data.date) {
                data.event_date = data.date;
                delete data.date;
            }
            if (data.time) {
                data.event_time = data.time;
                delete data.time;
            }

            const event = await pb.collection('events').update(id, data);
            return { success: true, event };
        } catch (err) {
            console.error('Failed to update event:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Delete an event
     * @param {string} id 
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async delete(id) {
        try {
            const pb = pbClient.client;
            await pb.collection('events').delete(id);
            return { success: true };
        } catch (err) {
            console.error('Failed to delete event:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Register for an event
     * @param {string} eventId 
     * @param {string} supplyClaim - Optional supply the user will bring
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async register(eventId, supplyClaim = '') {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) throw new Error('Not authenticated');

            await pb.collection('event_registrations').create({
                event: eventId,
                user: userId,
                supply_claim: supplyClaim
            });
            return { success: true };
        } catch (err) {
            console.error('Failed to register for event:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Unregister from an event
     * @param {string} eventId 
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async unregister(eventId) {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) throw new Error('Not authenticated');

            const registrations = await pb.collection('event_registrations').getList(1, 1, {
                filter: `event = "${eventId}" && user = "${userId}"`
            });

            if (registrations.items.length > 0) {
                await pb.collection('event_registrations').delete(registrations.items[0].id);
            }
            return { success: true };
        } catch (err) {
            console.error('Failed to unregister from event:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Get registrations for an event
     * @param {string} eventId 
     * @returns {Promise<Array>}
     */
    async getRegistrations(eventId) {
        try {
            const pb = pbClient.client;
            const records = await pb.collection('event_registrations').getFullList({
                filter: `event = "${eventId}"`,
                expand: 'user'
            });
            return records;
        } catch (err) {
            console.error('Failed to fetch registrations:', err);
            return [];
        }
    },

    /**
     * Check if current user is registered for an event
     * @param {string} eventId 
     * @returns {Promise<boolean>}
     */
    async isRegistered(eventId) {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) return false;

            const registrations = await pb.collection('event_registrations').getList(1, 1, {
                filter: `event = "${eventId}" && user = "${userId}"`
            });
            return registrations.items.length > 0;
        } catch (err) {
            return false;
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.eventsApi = eventsApi;
}

export default eventsApi;
