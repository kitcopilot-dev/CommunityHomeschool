import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initManageKids } from '../src/manage-kids';

describe('Manage Kids Functionality', () => {
    let elements;

    beforeEach(() => {
        sessionStorage.clear();
        
        document.body.innerHTML = `
            <button id="addChildBtn"></button>
            <div id="modalOverlay" style="display:none"></div>
            <button id="closeModalBtn"></button>
            <form id="kidForm">
                <input name="fullName" />
                <input name="age" />
            </form>
            <div id="kidsDashboard">
                <div id="kidsGrid"></div>
            </div>
            <div id="vaultSection" style="display:none"></div>
            <h1 id="vaultTitle"></h1>
            <p id="vaultSubtitle"></p>
            <button id="backToDashboardBtn"></button>
        `;

        elements = {
            addBtn: document.getElementById('addChildBtn'),
            modalOverlay: document.getElementById('modalOverlay'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            kidForm: document.getElementById('kidForm'),
            kidsGrid: document.getElementById('kidsGrid'),
            vaultSection: document.getElementById('vaultSection'),
            vaultTitle: document.getElementById('vaultTitle'),
            vaultSubtitle: document.getElementById('vaultSubtitle'),
            backToDashboardBtn: document.getElementById('backToDashboardBtn')
        };

        initManageKids(elements);
    });

    it('should open modal when add button is clicked', () => {
        elements.addBtn.click();
        expect(elements.modalOverlay.style.display).toBe('flex');
    });

    it('should add a new kid card on form submit', () => {
        elements.kidForm.querySelector('[name="fullName"]').value = 'New Kid';
        elements.kidForm.querySelector('[name="age"]').value = '10';
        
        elements.kidForm.dispatchEvent(new Event('submit'));

        const cards = elements.kidsGrid.querySelectorAll('.kid-card');
        expect(cards.length).toBe(1);
        expect(cards[0].querySelector('h3').textContent).toBe('New Kid');
    });

    it('should show vault when vault button is clicked', () => {
        // Add a kid first
        elements.kidForm.querySelector('[name="fullName"]').value = 'Test Kid';
        elements.kidForm.querySelector('[name="age"]').value = '8';
        elements.kidForm.dispatchEvent(new Event('submit'));
        
        const vaultBtn = elements.kidsGrid.querySelector('.vault-btn');
        vaultBtn.click();
        
        expect(elements.vaultSection.style.display).toBe('block');
        expect(document.getElementById('kidsDashboard').style.display).toBe('none');
        expect(elements.vaultTitle.textContent).toBe("Test Kid's Vault");
    });
});
