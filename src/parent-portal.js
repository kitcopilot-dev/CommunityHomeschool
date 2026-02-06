// src/parent-portal.js
function initParentPortal(elements) {
    if (!elements) return;

    // Configuration
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.startsWith('100.') || 
                  window.location.hostname.includes('how-november') ||
                  window.location.hostname === '44.240.253.236' ||
                  window.location.port === '8000';
    
    // PERSISTENCE FOR PROTOTYPE
    let USERS = JSON.parse(sessionStorage.getItem('village_users')) || [
        { email: "justin@village.com", password: "password123", name: "The Lynch Family", coords: null, desc: "", loc: "", kids: "" },
        { email: "kitt@village.com", password: "test-password-99", name: "The Test Family", coords: null, desc: "", loc: "", kids: "" }
    ];

    let isAuthenticated = sessionStorage.getItem('village_auth') === 'true';
    let currentUser = JSON.parse(sessionStorage.getItem('village_current_user'));
    let viewOnlyMode = sessionStorage.getItem('village_view_only') === 'true';

    console.log("Village Portal Initialized. Dev Mode:", isDev, "Auth State:", isAuthenticated);

    function saveSession() {
        sessionStorage.setItem('village_auth', isAuthenticated);
        sessionStorage.setItem('village_view_only', viewOnlyMode);
        sessionStorage.setItem('village_current_user', JSON.stringify(currentUser));
        sessionStorage.setItem('village_users', JSON.stringify(USERS));
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

    function renderProfile() {
        if (!currentUser) return;
        if (elements.profileEmail) elements.profileEmail.innerText = currentUser.email;
        if (elements.profileFamilyName) elements.profileFamilyName.innerText = currentUser.name || "Family";
        if (elements.profileDescription) elements.profileDescription.innerText = currentUser.desc || "No description provided.";
        if (elements.profileLocation) elements.profileLocation.innerText = currentUser.loc || "Not set";
        if (elements.profileChildrenAges) elements.profileChildrenAges.innerText = currentUser.kids || "None listed";

        // Sync back to Edit fields
        if (elements.editFamilyName) elements.editFamilyName.value = currentUser.name || "";
        if (elements.editDescription) elements.editDescription.value = currentUser.desc || "";
        if (elements.editLocation) elements.editLocation.value = currentUser.loc || "";
        if (elements.editChildrenAges) elements.editChildrenAges.value = currentUser.kids || "";
    }

    // Restore session on page load
    if (isAuthenticated || viewOnlyMode) {
        hideAllSections();
        if (elements.profileSection) elements.profileSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
        renderProfile();
    }

    function checkAuth(callback) {
        if (isAuthenticated) {
            callback();
        } else if (viewOnlyMode) {
            alert("Guest View: Please login with a valid account to use functional features.");
            hideAllSections();
            elements.authSection.style.display = 'block';
        } else {
            alert("Please login to access this section.");
            hideAllSections();
            elements.authSection.style.display = 'block';
        }
    }

    // Public Section Navigation
    elements.viewLegalGuidesBtn?.addEventListener('click', () => {
        hideAllSections();
        if (elements.legalGuidesSection) elements.legalGuidesSection.style.display = 'block';
        loadLegalGuides();
    });

    elements.backFromLegalBtn?.addEventListener('click', () => {
        hideAllSections();
        if (isAuthenticated || viewOnlyMode) {
            elements.profileSection.style.display = 'block';
        } else {
            elements.authSection.style.display = 'block';
        }
    });

    // Login Logic
    elements.loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const email = elements.loginEmail?.value;
        const password = elements.loginPassword?.value;

        const foundUser = USERS.find(u => u.email === email && u.password === password);

        if (foundUser) {
            isAuthenticated = true;
            currentUser = foundUser;
            viewOnlyMode = false;
            renderProfile();
            saveSession();
        } 
        else if (isDev && !email && !password) {
            isAuthenticated = false;
            viewOnlyMode = true;
            currentUser = { email: 'guest@village.com', name: 'Guest', desc: "Guest Mode", loc: "Localhost", kids: "" };
            renderProfile();
            saveSession();
        } 
        else {
            alert("Invalid email or password.");
            return;
        }

        hideAllSections();
        if (elements.profileSection) elements.profileSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
    });

    // Registration Simulation
    elements.registerBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail')?.value;
        const password = document.getElementById('registerPassword')?.value;
        const familyName = document.getElementById('registerFamilyName')?.value;
        
        if (!email || !password || !familyName) {
            alert("Please fill in all registration fields.");
            return;
        }

        const newUser = { email, password, name: familyName + " Family", coords: null, desc: "", loc: "", kids: "" };
        USERS.push(newUser);
        
        isAuthenticated = true;
        currentUser = newUser;
        viewOnlyMode = false;
        
        renderProfile();
        saveSession();

        hideAllSections();
        if (elements.profileSection) elements.profileSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
    });

    // Edit Profile Logic
    document.getElementById('useCurrentProfileLocationBtn')?.addEventListener('click', () => {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isSecure = window.location.protocol === 'https:';

        if (!isSecure && !isLocalhost) {
            alert("Location requires a secure connection (HTTPS) or Localhost. Since we are on a dev IP, please enter your location manually below.");
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                if (currentUser) currentUser.coords = { lat, lon };

                if (elements.editLocation) {
                    elements.editLocation.value = "Fetching address...";
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
                        const data = await response.json();
                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Unknown City";
                        const state = data.address.state || "Unknown State";
                        elements.editLocation.value = `${city}, ${state}`;
                    } catch (e) {
                        console.error("Reverse Geocoding Error:", e);
                        elements.editLocation.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                    }
                }
            }, (err) => {
                alert("Unable to retrieve location: " + err.message);
            });
        }
    });

    elements.saveProfileBtn?.addEventListener('click', () => {
        if (currentUser) {
            // Update copy
            currentUser.name = elements.editFamilyName?.value || currentUser.name;
            currentUser.desc = elements.editDescription?.value || "";
            currentUser.loc = elements.editLocation?.value || "";
            currentUser.kids = elements.editChildrenAges?.value || "";

            // Sync back to master list if authenticated
            if (isAuthenticated) {
                const index = USERS.findIndex(u => u.email === currentUser.email);
                if (index !== -1) USERS[index] = currentUser;
            }

            renderProfile();
            saveSession();
        }
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    // Events Search Location Logic
    elements.useMyLocationBtn?.addEventListener('click', () => {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isSecure = window.location.protocol === 'https:';

        if (!isSecure && !isLocalhost) {
            alert("Location requires a secure connection (HTTPS) or Localhost. Since we are on a dev IP, please enter your radius center manually.");
            return;
        }

        if (navigator.geolocation) {
            if (elements.myLocationDisplay) elements.myLocationDisplay.innerText = "Locating...";
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                if (elements.myLocationDisplay) {
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
                        const data = await response.json();
                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Unknown City";
                        elements.myLocationDisplay.innerText = `📍 ${city}`;
                    } catch (e) {
                        elements.myLocationDisplay.innerText = `📍 ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
                    }
                }
            }, (err) => {
                alert("Unable to retrieve location: " + err.message);
                if (elements.myLocationDisplay) elements.myLocationDisplay.innerText = "";
            });
        }
    });

    elements.logoutBtn?.addEventListener('click', () => {
        isAuthenticated = false;
        viewOnlyMode = false;
        currentUser = null;
        saveSession();
        hideAllSections();
        if (elements.authSection) elements.authSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'none';
        if (elements.loginEmail) elements.loginEmail.value = '';
        if (elements.loginPassword) elements.loginPassword.value = '';
    });

    // Protected Navigation
    elements.manageKidsBtn?.addEventListener('click', () => {
        checkAuth(() => { window.location.href = 'manage_kids.html'; });
    });

    elements.editProfileBtn?.addEventListener('click', () => {
        checkAuth(() => {
            hideAllSections();
            if (elements.editProfileSection) elements.editProfileSection.style.display = 'block';
        });
    });

    elements.viewEventsBtn?.addEventListener('click', () => {
        checkAuth(() => {
            hideAllSections();
            if (elements.eventsSection) elements.eventsSection.style.display = 'block';
            renderEvents();
        });
    });

    elements.createEventBtn?.addEventListener('click', () => {
        hideAllSections();
        if (elements.createEventSection) elements.createEventSection.style.display = 'block';
    });

    elements.saveEventBtn?.addEventListener('click', () => {
        const title = document.getElementById('eventTitle')?.value;
        const date = document.getElementById('eventDate')?.value;
        const time = document.getElementById('eventTime')?.value;
        const loc = document.getElementById('eventLocation')?.value;
        const desc = document.getElementById('eventDescription')?.value;

        if (!title || !date) {
            alert("Title and Date are required.");
            return;
        }

        const events = JSON.parse(sessionStorage.getItem('village_events')) || [];
        events.push({ title, date, time, loc, desc });
        sessionStorage.setItem('village_events', JSON.stringify(events));

        hideAllSections();
        if (elements.eventsSection) elements.eventsSection.style.display = 'block';
        renderEvents();
    });

    elements.cancelCreateEventBtn?.addEventListener('click', () => {
        hideAllSections();
        if (elements.eventsSection) elements.eventsSection.style.display = 'block';
    });

    function renderEvents() {
        if (!elements.eventsList) return;
        const events = JSON.parse(sessionStorage.getItem('village_events')) || [];
        elements.eventsList.innerHTML = '';
        
        if (events.length === 0) {
            elements.eventsList.innerHTML = '<p style="color:var(--text-muted);">No community gatherings planned yet. Be the first to start one!</p>';
            return;
        }

        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `
                <h3>${event.title}</h3>
                <p class="event-date">🗓️ ${event.date} • ${event.time || 'All Day'}</p>
                <p>📍 ${event.loc || 'TBD'}</p>
                <p>${event.desc || ''}</p>
            `;
            elements.eventsList.appendChild(item);
        });
    }

    elements.viewDashboardBtn?.addEventListener('click', () => {
        checkAuth(() => {
            hideAllSections();
            if (elements.dashboardSection) elements.dashboardSection.style.display = 'block';
        });
    });

    elements.backFromDashboardBtn?.addEventListener('click', () => {
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    elements.backFromEventsBtn?.addEventListener('click', () => {
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    elements.cancelEditBtn?.addEventListener('click', () => {
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    async function loadLegalGuides() {
        if (!elements.legalStatesList) return;
        try {
            const response = await fetch('state_laws_data.json');
            const data = await response.json();
            
            elements.legalStatesList.innerHTML = '';
            data.forEach(state => {
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
        } catch (e) {
            console.error("Error loading legal guides", e);
        }
    }

    function showLegalDetail(state) {
        hideAllSections();
        if (elements.legalDetailSection) {
            elements.legalDetailSection.style.display = 'block';
            document.getElementById('legalDetailStateName').innerText = state.state_name;
            
            const requirements = JSON.parse(state.key_requirements);
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
}

if (typeof exports !== 'undefined') {
    module.exports = { initParentPortal };
}
