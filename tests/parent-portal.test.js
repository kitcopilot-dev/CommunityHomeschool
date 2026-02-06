import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initParentPortal } from '../src/parent-portal';

describe('Parent Portal Navigation', () => {
    let elements;

    beforeEach(() => {
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
            <button id="loginBtn"></button>
            <button id="logoutBtn" style="display:none"></button>
            <button id="manageKidsBtn"></button>
            <button id="editProfileBtn"></button>
            <button id="viewEventsBtn"></button>
            <button id="viewDashboardBtn"></button>
            <button id="viewLegalGuidesBtn"></button>
            <div id="profileEmail"></div>
            <div id="profileFamilyName"></div>
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
            logoutBtn: document.getElementById('logoutBtn'),
            manageKidsBtn: document.getElementById('manageKidsBtn'),
            editProfileBtn: document.getElementById('editProfileBtn'),
            viewEventsBtn: document.getElementById('viewEventsBtn'),
            viewDashboardBtn: document.getElementById('viewDashboardBtn'),
            viewLegalGuidesBtn: document.getElementById('viewLegalGuidesBtn'),
            profileEmail: document.getElementById('profileEmail'),
            profileFamilyName: document.getElementById('profileFamilyName')
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

    it('should fail login with incorrect password', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'wrong-password';
        elements.loginBtn.click();

        expect(elements.authSection.style.display).not.toBe('none');
        expect(alertMock).toHaveBeenCalledWith("Invalid email or password.");
        alertMock.mockRestore();
    });

    it('should allow new user registration', () => {
        const regEmail = document.getElementById('registerEmail');
        const regFamily = document.getElementById('registerFamilyName');
        
        regEmail.value = 'new@user.com';
        regFamily.value = 'Newbie';
        
        elements.registerBtn.click();

        expect(elements.profileSection.style.display).toBe('block');
        expect(elements.profileEmail.innerText).toBe('new@user.com');
        expect(elements.profileFamilyName.innerText).toBe('Newbie Family');
    });

    it('should navigate to edit profile when authenticated', () => {
        // Authenticate first
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'password123';
        elements.loginBtn.click();
        
        elements.editProfileBtn.click();
        expect(elements.editProfileSection.style.display).toBe('block');
        expect(elements.profileSection.style.display).toBe('none');
    });

    it('should navigate to dashboard when authenticated', () => {
        // Authenticate first
        elements.loginEmail.value = 'justin@village.com';
        elements.loginPassword.value = 'password123';
        elements.loginBtn.click();

        elements.viewDashboardBtn.click();
        expect(elements.dashboardSection.style.display).toBe('block');
        expect(elements.profileSection.style.display).toBe('none');
    });
});
