import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initManageKids } from '../src/manage-kids';

describe('Manage Kids Functionality', () => {
    let elements;

    beforeEach(() => {
        document.body.innerHTML = `
            <button id="addChildBtn"></button>
            <div id="modalOverlay" style="display:none"></div>
            <button id="closeModalBtn"></button>
            <form id="kidForm">
                <input name="fullName" />
                <input name="age" />
            </form>
            <div id="kidsGrid"></div>
            <div id="vaultSection" style="display:none"></div>
            <h1 id="vaultTitle"></h1>
            <p id="vaultSubtitle"></p>
            <button id="backToDashboardBtn"></button>
            <div class="kid-card">
                <h3>Test Kid</h3>
                <button class="vault-btn"></button>
            </div>
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
            backToDashboardBtn: document.getElementById('backToDashboardBtn'),
            vaultBtns: document.querySelectorAll('.vault-btn')
        };

        initManageKids(elements);
    });

    it('should open modal when add button is clicked', () => {
        elements.addBtn.click();
        expect(elements.modalOverlay.style.display).toBe('flex');
    });

    it('should show vault when vault button is clicked', () => {
        elements.vaultBtns[0].click();
        expect(elements.vaultSection.style.display).toBe('block');
        expect(elements.kidsGrid.style.display).toBe('none');
        expect(elements.vaultTitle.textContent).toBe("Test Kid's Vault");
    });

    it('should add a new kid card on form submit', () => {
        elements.kidForm.querySelector('[name="fullName"]').value = 'New Kid';
        elements.kidForm.querySelector('[name="age"]').value = '10';
        
        elements.kidForm.dispatchEvent(new Event('submit'));

        const cards = elements.kidsGrid.querySelectorAll('.kid-card');
        expect(cards.length).toBe(1);
        expect(cards[0].querySelector('h3').textContent).toBe('New Kid');
    });
});
