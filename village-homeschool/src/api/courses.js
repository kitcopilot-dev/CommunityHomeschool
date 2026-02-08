/**
 * Courses API Module
 * CRUD operations for course/lesson tracking in PocketBase
 */

import pbClient from './pb.js';

const coursesApi = {
    /**
     * Get all courses for a specific child
     * @param {string} childId 
     * @returns {Promise<Array>}
     */
    async getByChild(childId) {
        try {
            const pb = pbClient.client;
            const records = await pb.collection('courses').getFullList({
                filter: `child = "${childId}"`,
                sort: 'name'
            });
            return records;
        } catch (err) {
            console.error('Failed to fetch courses:', err);
            return [];
        }
    },

    /**
     * Get all courses for all children of the current user
     * @returns {Promise<Array>}
     */
    async getAllForUser() {
        try {
            const pb = pbClient.client;
            const userId = pb.authStore.model?.id;
            if (!userId) return [];

            // Get all children first
            const children = await pb.collection('children').getFullList({
                filter: `user = "${userId}"`
            });

            if (children.length === 0) return [];

            // Build filter for all children
            const childIds = children.map(c => `child = "${c.id}"`).join(' || ');
            const courses = await pb.collection('courses').getFullList({
                filter: childIds,
                expand: 'child'
            });
            return courses;
        } catch (err) {
            console.error('Failed to fetch all courses:', err);
            return [];
        }
    },

    /**
     * Create a new course for a child
     * @param {string} childId 
     * @param {object} data - { name, total_lessons, current_lesson }
     * @returns {Promise<{success: boolean, course?: object, error?: string}>}
     */
    async create(childId, data) {
        try {
            const pb = pbClient.client;
            const course = await pb.collection('courses').create({
                child: childId,
                name: data.name,
                total_lessons: parseInt(data.total_lessons) || 180,
                current_lesson: parseInt(data.current_lesson) || 1,
                start_date: new Date().toISOString().split('T')[0]
            });
            return { success: true, course };
        } catch (err) {
            console.error('Failed to create course:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Update course progress (advance/decrement lesson)
     * @param {string} courseId 
     * @param {number} newLesson 
     * @returns {Promise<{success: boolean, course?: object, error?: string}>}
     */
    async updateProgress(courseId, newLesson) {
        try {
            const pb = pbClient.client;
            const course = await pb.collection('courses').update(courseId, {
                current_lesson: newLesson
            });
            return { success: true, course };
        } catch (err) {
            console.error('Failed to update course:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Update course details
     * @param {string} courseId 
     * @param {object} data 
     * @returns {Promise<{success: boolean, course?: object, error?: string}>}
     */
    async update(courseId, data) {
        try {
            const pb = pbClient.client;
            const course = await pb.collection('courses').update(courseId, data);
            return { success: true, course };
        } catch (err) {
            console.error('Failed to update course:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Delete a course
     * @param {string} courseId 
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async delete(courseId) {
        try {
            const pb = pbClient.client;
            await pb.collection('courses').delete(courseId);
            return { success: true };
        } catch (err) {
            console.error('Failed to delete course:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Calculate aggregate stats for dashboard
     * @returns {Promise<{totalCourses: number, avgProgress: number, completed: number}>}
     */
    async getStats() {
        try {
            const courses = await this.getAllForUser();
            if (courses.length === 0) {
                return { totalCourses: 0, avgProgress: 0, completed: 0 };
            }

            let totalProgress = 0;
            let completed = 0;

            for (const course of courses) {
                const progress = (course.current_lesson / course.total_lessons) * 100;
                totalProgress += progress;
                if (course.current_lesson >= course.total_lessons) {
                    completed++;
                }
            }

            return {
                totalCourses: courses.length,
                avgProgress: Math.round(totalProgress / courses.length),
                completed
            };
        } catch (err) {
            console.error('Failed to get stats:', err);
            return { totalCourses: 0, avgProgress: 0, completed: 0 };
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.coursesApi = coursesApi;
}

export default coursesApi;
