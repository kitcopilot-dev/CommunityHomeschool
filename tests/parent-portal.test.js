import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initParentPortal } from '../src/parent-portal';

describe('Parent Portal Navigation', () => {
    let elements;

    beforeEach(() => {
        // Clear session storage to avoid bleed-through between tests
        sessionStorage.clear();

        document.body.innerHTML = `
            <div id="authSection"></div>
            <div id="profileSection" style="display:none"></div>
            <div id="editProfileSection" style="display:none"></div>
            <div id="eventsSection" style="display:none"></div>
            <div id="dashboardSection" style="display:none"></div>
            <div id="legalGuidesSection" style="display:none"></div>
            <div id="legalDetailSection" style="display:none"></div>
            <div id="legalStatesList"></div>
            <input id="loginEmail" />
            <input id="loginPassword" />
            <input id="registerEmail" />
            <input id="registerPassword" />
            <input id="registerFamilyName" />
            <button id="loginBtn"></button>
            <button id="registerBtn"></button>
            <button id="logoutBtn" style="display:none"></button>
            <button id="manageKidsBtn"></button>
            <button id="editProfileBtn"></button>
            <button id="viewEventsBtn"></button>
            <button id="viewDashboardBtn"></button>
            <button id="viewLegalGuidesBtn"></button>
            <button id="saveProfileBtn"></button>
            <button id="useCurrentProfileLocationBtn"></button>
            <div id="profileEmail"></div>
            <div id="profileFamilyName"></div>
            <div id="profileDescription"></div>
            <div id="profileLocation"></div>
            <div id="profileChildrenAges"></div>
            <input id="editFamilyName" />
            <textarea id="editDescription"></textarea>
            <input id="editLocation" />
            <input id="editChildrenAges" />
        `;

        elements = {
            authSection: document.getElementById('authSection'),
            profileSection: document.getElementById('profileSection'),
            editProfileSection: document.getElementById('editProfileSection'),
            eventsSection: document.getElementById('eventsSection'),
            dashboardSection: document.getElementById('dashboardSection'),
            legalGuidesSection: document.getElementById('legalGuidesSection'),
            legalDetailSection: document.getElementById('legalDetailSection'),
            legalStatesList: document.getElementById('legalStatesList'),
            loginEmail: document.getElementById('loginEmail'),
            loginPassword: document.getElementById('loginPassword'),
            loginBtn: document.getElementById('loginBtn'),
            registerBtn: document.getElementById('registerBtn'),
            logoutBtn: document.getElementById('logoutBtn'),
            manageKidsBtn: document.getElementById('manageKidsBtn'),
            editProfileBtn: document.getElementById('editProfileBtn'),
            viewEventsBtn: document.getElementById('viewEventsBtn'),
            viewDashboardBtn: document.getElementById('viewDashboardBtn'),
            viewLegalGuidesBtn: document.getElementById('viewLegalGuidesBtn'),
            profileEmail: document.getElementById('profileEmail'),
            profileFamilyName: document.getElementById('profileFamilyName'),
            profileDescription: document.getElementById('profileDescription'),
            profileLocation: document.getElementById('profileLocation'),
            profileChildrenAges: document.getElementById('profileChildrenAges'),
            editFamilyName: document.getElementById('editFamilyName'),
            editDescription: document.getElementById('editDescription'),
            editLocation: document.getElementById('editLocation'),
            editChildrenAges: document.getElementById('editChildrenAges'),
            saveProfileBtn: document.getElementById('saveProfileBtn')
        };

        initParentPortal(elements);
    });

    it('should show profile and hide auth on login with correct credentials', () => {
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'password123';
        elements.loginBtn.click();

        expect(elements.authSection.style.display).toBe('none');
        expect(elements.profileSection.style.display).toBe('block');
        expect(elements.profileEmail.innerText).toBe('justin@village.com');
        expect(elements.profileFamilyName.innerText).toBe('The Lynch Family');
    });

    it('should show profile for the Kitt test user', () => {
        elements.loginEmail.value = 'kitt@village.com';
        elements.loginPassword.value = 'test-password-99';
        elements.loginBtn.click();

        expect(elements.profileSection.style.display).toBe('block');
        expect(elements.profileEmail.innerText).toBe('kitt@village.com');
        expect(elements.profileFamilyName.innerText).toBe('The Test Family');
    });

    it('should fail login with incorrect password', () => {
        // Mock alert to prevent test runner warning
        window.alert = vi.fn();
        
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'wrong-password';
        elements.loginBtn.click();

        expect(elements.authSection.style.display).not.toBe('none');
        expect(window.alert).toHaveBeenCalledWith("Invalid email or password.");
    });

    it('should allow new user registration and subsequent login', () => {
        const regEmail = document.getElementById('registerEmail');
        const regPassword = document.getElementById('registerPassword');
        const regFamily = document.getElementById('registerFamilyName');
        
        regEmail.value = 'jlynch8080@pm.me';
        regPassword.value = 'test-pass-123';
        regFamily.value = 'Jlynch';
        
        elements.registerBtn.click();

        expect(elements.profileSection.style.display).toBe('block');
        expect(elements.profileEmail.innerText).toBe('jlynch8080@pm.me');
        
        // Logout
        elements.logoutBtn.click();
        expect(elements.authSection.style.display).toBe('block');
        
        // Try Login
        elements.loginEmail.value = 'jlynch8080@pm.me';
        elements.loginPassword.value = 'test-pass-123';
        elements.loginBtn.click();
        
        expect(elements.profileSection.style.display).toBe('block');
        expect(elements.profileEmail.innerText).toBe('jlynch8080@pm.me');
    });

    it('should update profile on save', () => {
        // Authenticate
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'password123';
        elements.loginBtn.click();
        
        elements.editFamilyName.value = 'Updated Lynch';
        elements.editDescription.value = 'New description';
        elements.editLocation.value = 'Texas';
        
        elements.saveProfileBtn.click();
        
        expect(elements.profileFamilyName.innerText).toBe('Updated Lynch');
        expect(elements.profileDescription.innerText).toBe('New description');
        expect(elements.profileLocation.innerText).toBe('Texas');
    });

    it('should navigate to edit profile when authenticated', () => {
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'password123';
        elements.loginBtn.click();
        
        elements.editProfileBtn.click();
        expect(elements.editProfileSection.style.display).toBe('block');
        expect(elements.profileSection.style.display).toBe('none');
    });

    it('should navigate to dashboard when authenticated', () => {
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'password123';
        elements.loginBtn.click();

        elements.viewDashboardBtn.click();
        expect(elements.dashboardSection.style.display).toBe('block');
        expect(elements.profileSection.style.display).toBe('none');
    });
});
