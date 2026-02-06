function initManageKids(elements) {
    if (!elements) return;

    // Load kids from storage
    let kids = JSON.parse(sessionStorage.getItem('village_kids')) || [];

    function renderKids() {
        if (!elements.kidsGrid) return;
        elements.kidsGrid.innerHTML = '';
        
        if (kids.length === 0) {
            elements.kidsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; background: white; border-radius: var(--radius); border: 2px dashed var(--border);">
                    <p style="font-size: 1.2rem; color: var(--text-muted);">No children added yet. Click "Add Child" to get started!</p>
                </div>`;
            return;
        }

        kids.forEach((kid, index) => {
            const card = document.createElement('div');
            card.className = 'kid-card age-' + (kid.age > 12 ? '13' : kid.age > 5 ? '9' : '6');
            card.innerHTML = `
                <div class="kid-header">
                    <div class="avatar" style="background: var(--secondary);">${kid.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="kid-info">
                        <h3>${kid.name}</h3>
                        <span class="tag">Age ${kid.age} • ${kid.grade || 'Student'}</span>
                    </div>
                </div>
                <div class="progress-section">
                    <div class="progress-header"><span>Weekly Progress</span><span>0%</span></div>
                    <div class="progress-bar"><div class="progress-fill" style="width: 0%;"></div></div>
                </div>
                <div class="actions">
                    <button class="btn-icon" title="Edit Profile"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="btn-icon vault-btn" title="Learning Vault">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                </div>
            `;
            
            card.querySelector('.vault-btn')?.addEventListener('click', () => {
                showVault(kid.name);
            });

            elements.kidsGrid.appendChild(card);
        });
    }

    // Initial render
    renderKids();

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
        const newKid = {
            name: formData.get('fullName'),
            age: formData.get('age'),
            grade: formData.get('grade'),
            focus: formData.get('focus')
        };
        
        kids.push(newKid);
        sessionStorage.setItem('village_kids', JSON.stringify(kids));
        
        renderKids();
        if (elements.modalOverlay) elements.modalOverlay.style.display = 'none';
        elements.kidForm.reset();
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
            tabBtns.forEach(b => {
                b.style.color = 'var(--text-muted)';
                b.style.borderBottom = 'none';
            });
            btn.style.color = 'var(--primary)';
            btn.style.borderBottom = '3px solid var(--primary)';
            panes.forEach(p => p.style.display = 'none');
            const targetPane = document.getElementById('pane-' + target);
            if (targetPane) targetPane.style.display = 'block';
        });
    });
}

if (typeof exports !== 'undefined') {
    module.exports = { initManageKids };
}
