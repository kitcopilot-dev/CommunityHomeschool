/**
 * Children API Module
 * CRUD operations for children in PocketBase
 */

import pbClient from './pb.js';

const childrenApi = {
    /**
     * Get all children for the current user
     * @returns {Promise<Array>}
     */
    async getAll() {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) return [];

            const records = await pb.collection('children').getFullList({
                filter: `user = "${userId}"`,
                sort: 'name'
            });
            return records;
        } catch (err) {
            console.error('Failed to fetch children:', err);
            return [];
        }
    },

    /**
     * Get a single child by ID
     * @param {string} id 
     * @returns {Promise<object|null>}
     */
    async getById(id) {
        try {
            const pb = pbClient.client;
            return await pb.collection('children').getOne(id);
        } catch (err) {
            console.error('Failed to fetch child:', err);
            return null;
        }
    },

    /**
     * Create a new child
     * @param {object} data - { name, age, grade, focus }
     * @returns {Promise<{success: boolean, child?: object, error?: string}>}
     */
    async create(data) {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) throw new Error('Not authenticated');

            const child = await pb.collection('children').create({
                user: userId,
                name: data.name,
                age: parseInt(data.age) || 0,
                grade: data.grade || '',
                focus: data.focus || ''
            });
            return { success: true, child };
        } catch (err) {
            console.error('Failed to create child:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Update an existing child
     * @param {string} id 
     * @param {object} data 
     * @returns {Promise<{success: boolean, child?: object, error?: string}>}
     */
    async update(id, data) {
        try {
            const pb = pbClient.client;
            const child = await pb.collection('children').update(id, data);
            return { success: true, child };
        } catch (err) {
            console.error('Failed to update child:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Delete a child and their courses
     * @param {string} id 
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async delete(id) {
        try {
            const pb = pbClient.client;
            
            // First delete associated courses
            try {
                const courses = await pb.collection('courses').getFullList({
                    filter: `child = "${id}"`
                });
                for (const course of courses) {
                    await pb.collection('courses').delete(course.id);
                }
            } catch (e) {
                console.warn('Course cleanup failed:', e);
            }

            await pb.collection('children').delete(id);
            return { success: true };
        } catch (err) {
            console.error('Failed to delete child:', err);
            return { success: false, error: err.message };
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.childrenApi = childrenApi;
}

export default childrenApi;
