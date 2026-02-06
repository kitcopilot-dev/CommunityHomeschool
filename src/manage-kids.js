function initManageKids(elements) {
    if (!elements) return;

    elements.addBtn?.addEventListener('click', () => {
        if (elements.modalOverlay) elements.modalOverlay.style.display = 'flex';
    });

    elements.closeModalBtn?.addEventListener('click', () => {
        if (elements.modalOverlay) elements.modalOverlay.style.display = 'none';
    });

    elements.modalOverlay?.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
            elements.modalOverlay.style.display = 'none';
        }
    });

    elements.kidForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(elements.kidForm);
        const name = formData.get('fullName');
        const age = formData.get('age');
        
        const newCard = document.createElement('div');
        newCard.className = 'kid-card age-' + age;
        newCard.innerHTML = `
            <div class="kid-header">
                <div class="avatar">${name ? name.split(' ').map(n => n[0]).join('') : '??'}</div>
                <div class="kid-info">
                    <h3>${name}</h3>
                    <span class="tag">Age ${age}</span>
                </div>
            </div>
            <div class="progress-section">
                <div class="progress-header"><span>Weekly Progress</span><span>0%</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: 0%;"></div></div>
            </div>
            <div class="actions">
                <button class="btn-icon vault-btn" title="Learning Vault">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </button>
            </div>
        `;
        
        // Add event listener to the new vault button
        newCard.querySelector('.vault-btn')?.addEventListener('click', () => {
            showVault(name);
        });

        elements.kidsGrid?.appendChild(newCard);
        
        if (elements.modalOverlay) elements.modalOverlay.style.display = 'none';
        elements.kidForm.reset();
    });

    elements.vaultBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const kidName = btn.closest('.kid-card')?.querySelector('h3')?.textContent || 'Child';
            showVault(kidName);
        });
    });

    function showVault(name) {
        if (elements.kidsGrid) elements.kidsGrid.style.display = 'none';
        if (elements.vaultSection) elements.vaultSection.style.display = 'block';
        if (elements.vaultTitle) elements.vaultTitle.textContent = name + "'s Vault";
        if (elements.vaultSubtitle) elements.vaultSubtitle.textContent = "Stored resources and progress for " + name + ".";
    }

    elements.backToDashboardBtn?.addEventListener('click', () => {
        if (elements.kidsGrid) elements.kidsGrid.style.display = 'grid';
        if (elements.vaultSection) elements.vaultSection.style.display = 'none';
    });

    // Vault Tab Logic
    const tabBtns = document.querySelectorAll('.vault-tab-btn');
    const panes = document.querySelectorAll('.vault-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            
            // UI Update
            tabBtns.forEach(b => {
                b.style.color = 'var(--text-muted)';
                b.style.borderBottom = 'none';
            });
            btn.style.color = 'var(--primary)';
            btn.style.borderBottom = '3px solid var(--primary)';

            // Pane Update
            panes.forEach(p => p.style.display = 'none');
            const targetPane = document.getElementById('pane-' + target);
            if (targetPane) targetPane.style.display = 'block';
        });
    });
}

// Support for Vitest
if (typeof exports !== 'undefined') {
    module.exports = { initManageKids };
}
