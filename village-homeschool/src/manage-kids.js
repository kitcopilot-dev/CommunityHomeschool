// src/manage-kids.js
// Village Homeschool - PocketBase Integration

const PB_URL = 'https://bear-nan.exe.xyz';

async function initManageKids(elements) {
    if (!elements) return;

    // Load PocketBase SDK
    await loadScript('https://unpkg.com/pocketbase@0.21.1/dist/pocketbase.umd.js');
    const pb = new PocketBase(PB_URL);

    // Restore auth from localStorage
    const storedAuth = localStorage.getItem('village_pb_auth');
    if (storedAuth) {
        try {
            const parsed = JSON.parse(storedAuth);
            pb.authStore.save(parsed.token, parsed.model);
        } catch (e) {
            console.warn('Failed to restore auth:', e);
            localStorage.removeItem('village_pb_auth');
        }
    }

    // Check auth - redirect if not logged in
    if (!pb.authStore.isValid) {
        alert('Please login to manage your family.');
        window.location.href = 'index.html';
        return;
    }

    console.log("Manage Kids Initialized. User:", pb.authStore.model?.email);

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (window.PocketBase) { resolve(); return; }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    let kids = [];
    let currentKidIndex = null;
    let currentKidId = null;

    // Show logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
        logoutBtn.addEventListener('click', () => {
            pb.authStore.clear();
            localStorage.removeItem('village_pb_auth');
            window.location.href = 'index.html';
        });
    }

    // Load children from PocketBase
    async function loadKids() {
        try {
            const userId = pb.authStore.model?.id;
            const records = await pb.collection('children').getFullList({
                filter: `user = "${userId}"`,
                sort: 'name'
            });
            
            // Load courses for each child
            for (const kid of records) {
                try {
                    const courses = await pb.collection('courses').getFullList({
                        filter: `child = "${kid.id}"`,
                        sort: 'name'
                    });
                    kid.courses = courses;
                } catch (e) {
                    kid.courses = [];
                }
            }
            
            kids = records;
            return kids;
        } catch (err) {
            console.error('Failed to load children:', err);
            return [];
        }
    }

    function renderKids() {
        if (!elements.kidsGrid) return;
        elements.kidsGrid.innerHTML = '';

        if (kids.length === 0) {
            elements.kidsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 6rem 2rem; background: var(--bg-alt); border-radius: var(--radius-lg); border: 2px dashed var(--border);">
                    <h3 style="margin:0; font-style:normal; color:var(--text-muted);">No family members added yet.</h3>
                    <p style="margin-top:0.5rem;">Click "+ Add Child" above to start your journey.</p>
                </div>`;
            return;
        }

        kids.forEach((kid, index) => {
            const card = document.createElement('div');
            const ageNum = parseInt(kid.age);
            let ageClass = 'age-6';
            if (ageNum >= 13) ageClass = 'age-13';
            else if (ageNum >= 9) ageClass = 'age-9';

            // Calculate overall progress
            let totalProgress = 0;
            if (kid.courses && kid.courses.length > 0) {
                const sum = kid.courses.reduce((acc, c) => acc + ((c.current_lesson - 1) / c.total_lessons), 0);
                totalProgress = Math.round((sum / kid.courses.length) * 100);
            }

            card.className = `kid-card ${ageClass}`;
            card.innerHTML = `
                <div class="kid-header">
                    <div class="avatar">${kid.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="kid-info">
                        <h3>${kid.name}</h3>
                        <span class="tag">Age ${kid.age} • ${kid.grade || 'Student'}</span>
                    </div>
                </div>
                <div class="progress-section">
                    <div class="progress-header"><span>Overall Progress</span><span>${totalProgress}%</span></div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${totalProgress}%;"></div></div>
                </div>
                <div class="actions">
                    <button class="btn-icon edit-btn" title="Edit Profile" data-id="${kid.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon vault-btn" title="Learning Vault" data-index="${index}" data-id="${kid.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                    <button class="btn-icon delete-btn" title="Delete" data-id="${kid.id}" style="color: #ef4444;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;

            // Edit button
            card.querySelector('.edit-btn')?.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const kid = kids.find(k => k.id === id);
                if (kid) {
                    showEditChildModal(kid);
                }
            });

            // Vault button
            card.querySelector('.vault-btn')?.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                const id = e.currentTarget.dataset.id;
                showVault(idx, id);
            });

            // Delete button
            card.querySelector('.delete-btn')?.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                const kid = kids.find(k => k.id === id);
                if (confirm(`Delete ${kid?.name}? This will also remove all their courses.`)) {
                    try {
                        await pb.collection('children').delete(id);
                        await loadKids();
                        renderKids();
                    } catch (err) {
                        alert('Failed to delete: ' + err.message);
                    }
                }
            });

            elements.kidsGrid.appendChild(card);
        });
    }

    // Initial load
    await loadKids();
    renderKids();

    // Add Child Modal
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

    elements.kidForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(elements.kidForm);

        try {
            await pb.collection('children').create({
                user: pb.authStore.model.id,
                name: formData.get('fullName'),
                age: parseInt(formData.get('age')) || 0,
                grade: formData.get('grade') || '',
                focus: formData.get('focus') || ''
            });

            await loadKids();
            renderKids();
            if (elements.modalOverlay) elements.modalOverlay.style.display = 'none';
            elements.kidForm.reset();
        } catch (err) {
            alert('Failed to add child: ' + err.message);
        }
    });

    // Vault
    function showVault(index, id) {
        currentKidIndex = index;
        currentKidId = id;
        const kid = kids[index];

        const dashboard = document.getElementById('kidsDashboard');
        if (dashboard) dashboard.style.display = 'none';
        if (elements.vaultSection) elements.vaultSection.style.display = 'block';
        if (elements.vaultTitle) elements.vaultTitle.textContent = kid.name + "'s Vault";
        if (elements.vaultSubtitle) elements.vaultSubtitle.textContent = "Stored resources and progress for " + kid.name + ".";
        
        renderCourses();
    }

    function renderCourses() {
        if (!elements.courseProgressGrid) return;
        elements.courseProgressGrid.innerHTML = '';

        const kid = kids[currentKidIndex];
        if (!kid?.courses || kid.courses.length === 0) {
            elements.courseProgressGrid.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: var(--bg-alt); border-radius: var(--radius-md); border: 1px solid var(--border);">
                    <p style="color: var(--text-muted); font-size: 0.9rem;">No courses tracked yet. Add one to start monitoring progress.</p>
                </div>`;
            return;
        }

        kid.courses.forEach((course) => {
            const completed = course.current_lesson - 1;
            const pct = Math.round((completed / course.total_lessons) * 100);
            const isComplete = course.current_lesson > course.total_lessons;
            const courseEl = document.createElement('div');
            courseEl.className = 'vault-item';
            courseEl.style.flexDirection = 'column';
            courseEl.style.alignItems = 'stretch';
            courseEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="vault-icon" style="width: 32px; height: 32px; font-size: 1rem;">📚</div>
                        <div>
                            <h4 style="margin:0; font-family:var(--font-display);">${course.name}</h4>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">Day ${course.current_lesson} of ${course.total_lessons}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        ${isComplete ? `
                            <span style="background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.85rem; font-weight: 600;">✓ Complete!</span>
                        ` : `
                            <button class="complete-day-btn" data-id="${course.id}" data-current="${course.current_lesson}" data-total="${course.total_lessons}" style="background: var(--primary); color: white; padding: 0.5rem 1.25rem; border-radius: 2rem; font-size: 0.85rem; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                                <span>✓</span> Mark Day Complete
                            </button>
                        `}
                        <button class="delete-course-btn" data-id="${course.id}" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid #fecaca; background: #fee2e2; cursor: pointer; color: #ef4444; margin-left: 0.5rem;">×</button>
                    </div>
                </div>
                <div class="progress-bar" style="height: 8px;"><div class="progress-fill" style="width: ${pct}%;"></div></div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-muted);">
                    <span>${completed} lessons completed</span>
                    <span>${course.total_lessons - completed} remaining</span>
                </div>
            `;

            // Mark Day Complete button
            courseEl.querySelector('.complete-day-btn')?.addEventListener('click', async (e) => {
                const btn = e.currentTarget;
                const id = btn.dataset.id;
                const current = parseInt(btn.dataset.current);
                const total = parseInt(btn.dataset.total);
                
                if (current <= total) {
                    btn.disabled = true;
                    btn.innerHTML = '<span>⏳</span> Saving...';
                    try {
                        await pb.collection('courses').update(id, { current_lesson: current + 1 });
                        await loadKids();
                        renderCourses();
                    } catch (err) {
                        console.error('Update failed:', err);
                        btn.disabled = false;
                        btn.innerHTML = '<span>✓</span> Mark Day Complete';
                    }
                }
            });

            // Delete course button
            courseEl.querySelector('.delete-course-btn').addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Delete this course?')) {
                    try {
                        await pb.collection('courses').delete(id);
                        await loadKids();
                        renderCourses();
                    } catch (err) {
                        alert('Failed to delete: ' + err.message);
                    }
                }
            });

            elements.courseProgressGrid.appendChild(courseEl);
        });
    }

    // Edit Child Modal
    function showEditChildModal(kid) {
        if (elements.editChildId) elements.editChildId.value = kid.id;
        if (elements.editChildName) elements.editChildName.value = kid.name || '';
        if (elements.editChildAge) elements.editChildAge.value = kid.age || '';
        if (elements.editChildGrade) elements.editChildGrade.value = kid.grade || 'Preschool';
        if (elements.editChildFocus) elements.editChildFocus.value = kid.focus || '';
        if (elements.editChildModalOverlay) elements.editChildModalOverlay.style.display = 'flex';
    }

    elements.closeEditChildModalBtn?.addEventListener('click', () => {
        if (elements.editChildModalOverlay) elements.editChildModalOverlay.style.display = 'none';
    });

    elements.editChildModalOverlay?.addEventListener('click', (e) => {
        if (e.target === elements.editChildModalOverlay) {
            elements.editChildModalOverlay.style.display = 'none';
        }
    });

    elements.editChildForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const childId = elements.editChildId?.value;
        if (!childId) return;

        try {
            await pb.collection('children').update(childId, {
                name: elements.editChildName?.value || '',
                age: parseInt(elements.editChildAge?.value) || 0,
                grade: elements.editChildGrade?.value || '',
                focus: elements.editChildFocus?.value || ''
            });

            await loadKids();
            renderKids();
            if (elements.editChildModalOverlay) elements.editChildModalOverlay.style.display = 'none';
        } catch (err) {
            alert('Failed to update: ' + err.message);
        }
    });

    // Add Course Modal
    elements.addCourseBtn?.addEventListener('click', () => {
        if (elements.courseModalOverlay) elements.courseModalOverlay.style.display = 'flex';
    });

    elements.closeCourseModalBtn?.addEventListener('click', () => {
        if (elements.courseModalOverlay) elements.courseModalOverlay.style.display = 'none';
    });

    elements.courseForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(elements.courseForm);

        try {
            await pb.collection('courses').create({
                child: currentKidId,
                name: formData.get('courseName'),
                total_lessons: parseInt(formData.get('totalLessons')) || 180,
                current_lesson: parseInt(formData.get('currentLesson')) || 1,
                start_date: new Date().toISOString().split('T')[0]
            });

            await loadKids();
            renderCourses();
            if (elements.courseModalOverlay) elements.courseModalOverlay.style.display = 'none';
            elements.courseForm.reset();
        } catch (err) {
            alert('Failed to add course: ' + err.message);
        }
    });

    // Back button
    elements.backToDashboardBtn?.addEventListener('click', async () => {
        const dashboard = document.getElementById('kidsDashboard');
        if (dashboard) dashboard.style.display = 'block';
        if (elements.vaultSection) elements.vaultSection.style.display = 'none';
        await loadKids();
        renderKids();
    });

    // Parent Home button
    elements.parentHomeBtn?.addEventListener('click', () => {
        window.location.href = 'index.html';
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
            btn.style.borderBottom = '4px solid var(--primary)';
            panes.forEach(p => p.style.display = 'none');
            const targetPane = document.getElementById('pane-' + target);
            if (targetPane) targetPane.style.display = 'block';
        });
    });
}

if (typeof exports !== 'undefined') {
    module.exports = { initManageKids };
}
