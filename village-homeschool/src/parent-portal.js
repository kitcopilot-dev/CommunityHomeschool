// src/parent-portal.js
// Village Homeschool - PocketBase Integration

const PB_URL = 'https://bear-nan.exe.xyz';

async function initParentPortal(elements) {
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

    // Persist auth changes
    pb.authStore.onChange((token, model) => {
        if (token && model) {
            localStorage.setItem('village_pb_auth', JSON.stringify({ token, model }));
        } else {
            localStorage.removeItem('village_pb_auth');
        }
    });

    let currentProfile = null;

    console.log("Village Portal Initialized. Auth valid:", pb.authStore.isValid);

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

    function hideAllSections() {
        const sections = [
            elements.authSection, 
            elements.profileSection, 
            elements.editProfileSection, 
            elements.eventsSection, 
            elements.createEventSection,
            elements.dashboardSection, 
            elements.legalGuidesSection, 
            elements.legalDetailSection
        ];
        sections.forEach(s => { if(s) s.style.display = 'none'; });
    }

    function showMessage(elementId, message, isError = false) {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerText = message;
            el.style.color = isError ? '#ef4444' : '#22c55e';
        }
    }

    async function loadProfile() {
        if (!pb.authStore.isValid) return null;
        // Profile IS the auth record when logged in via profiles collection
        currentProfile = pb.authStore.model;
        return currentProfile;
    }

    function renderProfile() {
        const user = pb.authStore.model;
        if (!user) return;

        if (elements.profileEmail) elements.profileEmail.innerText = user.email;
        
        if (currentProfile) {
            if (elements.profileFamilyName) elements.profileFamilyName.innerText = currentProfile.family_name || "Family";
            if (elements.profileDescription) elements.profileDescription.innerText = currentProfile.description || "No description provided.";
            if (elements.profileLocation) elements.profileLocation.innerText = currentProfile.location || "Not set";
            if (elements.profileChildrenAges) elements.profileChildrenAges.innerText = currentProfile.children_ages || "None listed";

            // Sync to edit fields
            if (elements.editFamilyName) elements.editFamilyName.value = currentProfile.family_name || "";
            if (elements.editDescription) elements.editDescription.value = currentProfile.description || "";
            if (elements.editLocation) elements.editLocation.value = currentProfile.location || "";
            if (elements.editChildrenAges) elements.editChildrenAges.value = currentProfile.children_ages || "";
        } else {
            if (elements.profileFamilyName) elements.profileFamilyName.innerText = user.name || "Family";
        }
    }

    // Restore session on page load
    if (pb.authStore.isValid) {
        hideAllSections();
        if (elements.profileSection) elements.profileSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
        await loadProfile();
        renderProfile();
    }

    function checkAuth(callback) {
        if (pb.authStore.isValid) {
            callback();
        } else {
            alert("Please login to access this section.");
            hideAllSections();
            elements.authSection.style.display = 'block';
        }
    }

    // === LOGIN ===
    elements.loginBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = elements.loginEmail?.value?.trim();
        const password = elements.loginPassword?.value;

        if (!email || !password) {
            showMessage('loginMessage', 'Please enter email and password.', true);
            return;
        }

        try {
            showMessage('loginMessage', 'Logging in...');
            // Login via profiles collection (it's an auth collection)
            await pb.collection('profiles').authWithPassword(email, password);
            currentProfile = pb.authStore.model; // Profile IS the auth record
            renderProfile();
            
            hideAllSections();
            if (elements.profileSection) elements.profileSection.style.display = 'block';
            if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
            showMessage('loginMessage', '');
        } catch (err) {
            console.error('Login error:', err);
            showMessage('loginMessage', err.message || 'Invalid email or password.', true);
        }
    });

    // === REGISTRATION ===
    elements.registerBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail')?.value?.trim();
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
        const familyName = document.getElementById('registerFamilyName')?.value?.trim();

        if (!email || !password || !familyName) {
            showMessage('registerMessage', 'Please fill in all fields.', true);
            return;
        }

        if (password !== confirmPassword) {
            showMessage('registerMessage', 'Passwords do not match.', true);
            return;
        }

        if (password.length < 8) {
            showMessage('registerMessage', 'Password must be at least 8 characters.', true);
            return;
        }

        try {
            showMessage('registerMessage', 'Creating account...');
            
            // Create account directly in profiles (it's an auth collection)
            const userData = {
                email,
                password,
                passwordConfirm: confirmPassword,
                family_name: familyName + " Family",
                description: '',
                location: '',
                children_ages: ''
            };
            await pb.collection('profiles').create(userData);

            // Login
            await pb.collection('profiles').authWithPassword(email, password);
            currentProfile = pb.authStore.model;
            renderProfile();

            hideAllSections();
            if (elements.profileSection) elements.profileSection.style.display = 'block';
            if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
            showMessage('registerMessage', '');
        } catch (err) {
            console.error('Registration error:', err);
            showMessage('registerMessage', err.message || 'Registration failed.', true);
        }
    });

    // === LOGOUT ===
    elements.logoutBtn?.addEventListener('click', () => {
        pb.authStore.clear();
        localStorage.removeItem('village_pb_auth');
        currentProfile = null;
        
        hideAllSections();
        if (elements.authSection) elements.authSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'none';
        if (elements.loginEmail) elements.loginEmail.value = '';
        if (elements.loginPassword) elements.loginPassword.value = '';
    });

    // === EDIT PROFILE ===
    elements.editProfileBtn?.addEventListener('click', () => {
        checkAuth(() => {
            hideAllSections();
            if (elements.editProfileSection) elements.editProfileSection.style.display = 'block';
        });
    });

    elements.cancelEditBtn?.addEventListener('click', () => {
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    document.getElementById('useCurrentProfileLocationBtn')?.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                if (elements.editLocation) {
                    elements.editLocation.value = "Fetching address...";
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
                        const data = await response.json();
                        const city = data.address.city || data.address.town || data.address.village || "Unknown City";
                        const state = data.address.state || "Unknown State";
                        elements.editLocation.value = `${city}, ${state}`;
                    } catch (e) {
                        elements.editLocation.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                    }
                }
            }, (err) => {
                alert("Unable to retrieve location: " + err.message);
            });
        }
    });

    elements.saveProfileBtn?.addEventListener('click', async () => {
        if (!pb.authStore.isValid || !currentProfile) return;

        const data = {
            family_name: elements.editFamilyName?.value || '',
            description: elements.editDescription?.value || '',
            location: elements.editLocation?.value || '',
            children_ages: elements.editChildrenAges?.value || ''
        };

        try {
            showMessage('editProfileMessage', 'Saving...');
            
            // Update the current profile (auth record)
            await pb.collection('profiles').update(currentProfile.id, data);
            
            // Reload to get fresh data
            await loadProfile();
            renderProfile();
            
            hideAllSections();
            elements.profileSection.style.display = 'block';
            showMessage('editProfileMessage', '');
        } catch (err) {
            console.error('Profile save error:', err);
            showMessage('editProfileMessage', 'Failed to save: ' + err.message, true);
        }
    });

    // === NAVIGATION ===
    elements.manageKidsBtn?.addEventListener('click', () => {
        checkAuth(() => { window.location.href = 'manage_kids.html'; });
    });

    elements.viewEventsBtn?.addEventListener('click', () => {
        checkAuth(() => {
            hideAllSections();
            if (elements.eventsSection) elements.eventsSection.style.display = 'block';
            renderEvents();
        });
    });

    elements.viewDashboardBtn?.addEventListener('click', () => {
        checkAuth(() => {
            hideAllSections();
            if (elements.dashboardSection) elements.dashboardSection.style.display = 'block';
            loadDashboard();
        });
    });

    elements.viewLegalGuidesBtn?.addEventListener('click', () => {
        hideAllSections();
        if (elements.legalGuidesSection) elements.legalGuidesSection.style.display = 'block';
        loadLegalGuides();
    });

    elements.backFromEventsBtn?.addEventListener('click', () => {
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    elements.backFromDashboardBtn?.addEventListener('click', () => {
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    elements.backFromLegalBtn?.addEventListener('click', () => {
        hideAllSections();
        if (pb.authStore.isValid) {
            elements.profileSection.style.display = 'block';
        } else {
            elements.authSection.style.display = 'block';
        }
    });

    // === EVENTS ===
    elements.createEventBtn?.addEventListener('click', () => {
        hideAllSections();
        if (elements.createEventSection) elements.createEventSection.style.display = 'block';
    });

    elements.cancelCreateEventBtn?.addEventListener('click', () => {
        hideAllSections();
        if (elements.eventsSection) elements.eventsSection.style.display = 'block';
    });

    elements.saveEventBtn?.addEventListener('click', async () => {
        const title = document.getElementById('eventTitle')?.value;
        const date = document.getElementById('eventDate')?.value;
        const time = document.getElementById('eventTime')?.value;
        const location = document.getElementById('eventLocation')?.value;
        const description = document.getElementById('eventDescription')?.value;
        const ageSuitability = document.getElementById('eventAgeSuitability')?.value;
        const maxCapacity = document.getElementById('eventMaxCapacity')?.value;

        if (!title || !date) {
            showMessage('createEventMessage', 'Title and Date are required.', true);
            return;
        }

        try {
            showMessage('createEventMessage', 'Creating event...');
            await pb.collection('events').create({
                creator: pb.authStore.model.id,
                title,
                description: description || '',
                event_date: date,
                event_time: time || '',
                location: location || '',
                age_suitability: ageSuitability || 'All Ages',
                max_capacity: parseInt(maxCapacity) || 0
            });

            hideAllSections();
            if (elements.eventsSection) elements.eventsSection.style.display = 'block';
            renderEvents();
        } catch (err) {
            console.error('Event creation error:', err);
            showMessage('createEventMessage', 'Failed: ' + err.message, true);
        }
    });

    async function renderEvents() {
        if (!elements.eventsList) return;
        elements.eventsList.innerHTML = '<p style="color:var(--text-muted);">Loading events...</p>';

        try {
            const today = new Date().toISOString().split('T')[0];
            const records = await pb.collection('events').getList(1, 50, {
                filter: `event_date >= "${today}"`,
                sort: 'event_date',
                expand: 'creator'
            });

            if (records.items.length === 0) {
                elements.eventsList.innerHTML = '<p style="color:var(--text-muted);">No upcoming gatherings. Be the first to start one!</p>';
                return;
            }

            elements.eventsList.innerHTML = '';
            records.items.forEach(event => {
                const item = document.createElement('div');
                item.className = 'event-item';
                const creatorName = event.expand?.creator?.name || 'Unknown';
                item.innerHTML = `
                    <h3>${event.title}</h3>
                    <p class="event-date">🗓️ ${event.event_date} • ${event.event_time || 'All Day'}</p>
                    <p>📍 ${event.location || 'TBD'}</p>
                    <p>${event.description || ''}</p>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:1rem;">Hosted by ${creatorName}</p>
                `;
                elements.eventsList.appendChild(item);
            });
        } catch (err) {
            console.error('Events load error:', err);
            elements.eventsList.innerHTML = '<p style="color:#ef4444;">Failed to load events.</p>';
        }
    }

    // === DASHBOARD ===
    async function loadDashboard() {
        try {
            // Get all children for this user
            const userId = pb.authStore.model?.id;
            const children = await pb.collection('children').getFullList({
                filter: `user = "${userId}"`
            });

            if (children.length === 0) {
                document.getElementById('statTotal').innerText = '0';
                document.getElementById('statGraded').innerText = '0';
                document.getElementById('statPending').innerText = '0';
                document.getElementById('statAvgScore').innerText = '—';
                document.getElementById('subjectBars').innerHTML = '<p style="color:var(--text-muted);">Add children and courses to see progress.</p>';
                document.getElementById('assignmentsList').innerHTML = '<p style="color:var(--text-muted);">No assignments yet.</p>';
                return;
            }

            // Get all courses for these children
            const childIds = children.map(c => `child = "${c.id}"`).join(' || ');
            const courses = await pb.collection('courses').getFullList({
                filter: childIds,
                expand: 'child'
            });

            // Calculate stats
            let totalLessons = 0;
            let completedLessons = 0;
            courses.forEach(c => {
                totalLessons += c.total_lessons;
                completedLessons += c.current_lesson - 1; // current_lesson is next to do
            });

            const avgProgress = courses.length > 0 
                ? Math.round(courses.reduce((sum, c) => sum + (c.current_lesson / c.total_lessons * 100), 0) / courses.length)
                : 0;

            document.getElementById('statTotal').innerText = courses.length;
            document.getElementById('statGraded').innerText = completedLessons;
            document.getElementById('statPending').innerText = totalLessons - completedLessons;
            document.getElementById('statAvgScore').innerText = avgProgress + '%';

            // Subject bars
            const subjectBars = document.getElementById('subjectBars');
            subjectBars.innerHTML = '';
            courses.forEach(course => {
                const pct = Math.round((course.current_lesson / course.total_lessons) * 100);
                const childName = course.expand?.child?.name || 'Child';
                const bar = document.createElement('div');
                bar.style.marginBottom = '1.5rem';
                bar.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span style="font-weight:600;">${course.name}</span>
                        <span style="color:var(--text-muted); font-size:0.85rem;">${childName} • ${pct}%</span>
                    </div>
                    <div class="subject-bar-track">
                        <div class="subject-bar-fill" style="width:${pct}%; height:100%; border-radius:7px;"></div>
                    </div>
                `;
                subjectBars.appendChild(bar);
            });

            // Assignments list (placeholder - would need assignments collection)
            document.getElementById('assignmentsList').innerHTML = '<p style="color:var(--text-muted);">Assignment tracking coming soon.</p>';

        } catch (err) {
            console.error('Dashboard load error:', err);
        }
    }

    // === LEGAL GUIDES ===
    async function loadLegalGuides() {
        if (!elements.legalStatesList) return;
        try {
            const response = await fetch('state_laws_data.json');
            const data = await response.json();

            // Calculate stats
            let lowCount = 0, modCount = 0, highCount = 0;
            data.forEach(state => {
                if (state.regulation_level === 'Low') lowCount++;
                else if (state.regulation_level === 'Moderate') modCount++;
                else if (state.regulation_level === 'High') highCount++;
            });
            document.getElementById('legalCountLow').innerText = lowCount;
            document.getElementById('legalCountMod').innerText = modCount;
            document.getElementById('legalCountHigh').innerText = highCount;

            // Check user's state
            if (currentProfile?.location) {
                const userState = currentProfile.location.split(',').pop()?.trim();
                const matchedState = data.find(s => s.state_name.toLowerCase().includes(userState?.toLowerCase()));
                if (matchedState) {
                    document.getElementById('myStateName').innerText = matchedState.state_name;
                    document.getElementById('myStateHighlight').style.display = 'block';
                    document.getElementById('myStateJumpBtn').onclick = () => showLegalDetail(matchedState);
                }
            }

            renderLegalStates(data);

            // Search/filter handlers
            document.getElementById('legalSearchInput')?.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const level = document.getElementById('legalFilterLevel')?.value;
                const filtered = data.filter(s => 
                    s.state_name.toLowerCase().includes(query) &&
                    (!level || s.regulation_level === level)
                );
                renderLegalStates(filtered);
            });

            document.getElementById('legalFilterLevel')?.addEventListener('change', (e) => {
                const level = e.target.value;
                const query = document.getElementById('legalSearchInput')?.value?.toLowerCase() || '';
                const filtered = data.filter(s => 
                    s.state_name.toLowerCase().includes(query) &&
                    (!level || s.regulation_level === level)
                );
                renderLegalStates(filtered);
            });

        } catch (e) {
            console.error("Error loading legal guides", e);
            elements.legalStatesList.innerHTML = '<p style="color:#ef4444;">Failed to load state guides.</p>';
        }
    }

    function renderLegalStates(states) {
        elements.legalStatesList.innerHTML = '';
        states.forEach(state => {
            const card = document.createElement('div');
            card.className = 'legal-state-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <h4 style="margin:0; font-family:var(--font-display);">${state.state_name}</h4>
                    <span class="legal-reg-badge" style="background:${getRegColor(state.regulation_level)}; color:white; font-size:0.7rem;">${state.regulation_level}</span>
                </div>
                <p style="font-size:0.85rem; margin-top:1rem;">${state.summary.substring(0, 100)}...</p>
            `;
            card.addEventListener('click', () => showLegalDetail(state));
            elements.legalStatesList.appendChild(card);
        });
    }

    function showLegalDetail(state) {
        hideAllSections();
        if (elements.legalDetailSection) {
            elements.legalDetailSection.style.display = 'block';
            document.getElementById('legalDetailStateName').innerText = state.state_name;

            let requirements;
            try {
                requirements = typeof state.key_requirements === 'string' 
                    ? JSON.parse(state.key_requirements) 
                    : state.key_requirements;
            } catch (e) {
                requirements = {};
            }

            let reqHtml = '<ul style="list-style:none; padding:0; margin-top:2rem;">';
            for (const [key, value] of Object.entries(requirements)) {
                reqHtml += `
                    <li style="margin-bottom:1rem; padding:1rem; background:var(--bg-alt); border-radius:var(--radius-sm);">
                        <strong style="text-transform:capitalize; color:var(--primary);">${key.replace('_', ' ')}:</strong>
                        <span style="display:block; margin-top:0.25rem;">${value}</span>
                    </li>`;
            }
            reqHtml += '</ul>';

            document.getElementById('legalDetailContent').innerHTML = `
                <div style="background:var(--accent-soft); padding:1.5rem; border-radius:var(--radius-md); margin-bottom:2rem;">
                    <p><strong>Overview:</strong> ${state.summary}</p>
                </div>
                <h4 style="font-family:var(--font-display);">Key Requirements</h4>
                ${reqHtml}
                <div style="margin-top:2rem; padding-top:2rem; border-top:1px solid var(--border);">
                    <a href="${state.official_link}" target="_blank" style="color:var(--secondary); font-weight:700; text-decoration:none;">Official State Resource ↗</a>
                </div>
            `;
        }
    }

    function getRegColor(level) {
        switch(level) {
            case 'Low': return '#4B6344';
            case 'Moderate': return '#E6AF2E';
            case 'High': return '#D97757';
            default: return '#5C615A';
        }
    }

    document.getElementById('backFromLegalDetailBtn')?.addEventListener('click', () => {
        hideAllSections();
        elements.legalGuidesSection.style.display = 'block';
    });

    // Location for events
    elements.useMyLocationBtn?.addEventListener('click', () => {
        if (navigator.geolocation) {
            if (elements.myLocationDisplay) elements.myLocationDisplay.innerText = "Locating...";
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
                    const data = await response.json();
                    const city = data.address.city || data.address.town || data.address.village || "Unknown City";
                    if (elements.myLocationDisplay) elements.myLocationDisplay.innerText = `📍 ${city}`;
                } catch (e) {
                    if (elements.myLocationDisplay) elements.myLocationDisplay.innerText = `📍 ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
                }
            }, (err) => {
                alert("Unable to retrieve location: " + err.message);
                if (elements.myLocationDisplay) elements.myLocationDisplay.innerText = "";
            });
        }
    });
}

if (typeof exports !== 'undefined') {
    module.exports = { initParentPortal };
}
