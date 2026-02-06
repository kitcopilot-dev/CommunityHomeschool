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
    
    // HARDCODED SECURE CREDENTIALS (MOCKING)
    const USERS = [
        { email: "justin@village.com", password: "password123", name: "The Lynch Family" },
        { email: "kitt@village.com", password: "test-password-99", name: "The Test Family" }
    ];

    let isAuthenticated = false;
    let currentUser = null;
    let viewOnlyMode = false;

    console.log("Village Portal Initialized. Dev Mode:", isDev);

    function hideAllSections() {
        const sections = [
            elements.authSection, 
            elements.profileSection, 
            elements.editProfileSection, 
            elements.eventsSection, 
            elements.dashboardSection, 
            elements.legalGuidesSection, 
            elements.legalDetailSection
        ];
        sections.forEach(s => { if(s) s.style.display = 'none'; });
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

        console.log("Attempting login for:", email);

        const foundUser = USERS.find(u => u.email === email && u.password === password);

        if (foundUser) {
            console.log("Login: Success (Auth)");
            isAuthenticated = true;
            currentUser = foundUser;
            viewOnlyMode = false;
            elements.profileFamilyName.innerText = foundUser.name;
            elements.profileEmail.innerText = email;
        } 
        else if (isDev && !email && !password) {
            console.log("Login: Success (Guest Bypass)");
            isAuthenticated = false;
            viewOnlyMode = true;
            elements.profileFamilyName.innerText = 'Guest (View Only Mode)';
            elements.profileEmail.innerText = 'guest@village.com';
        } 
        else {
            console.warn("Login: Failed (Invalid Credentials)");
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

        console.log("Registering user:", email);
        const newUser = { email, password, name: familyName + " Family" };
        USERS.push(newUser);
        
        isAuthenticated = true;
        currentUser = newUser;
        viewOnlyMode = false;
        
        elements.profileFamilyName.innerText = newUser.name;
        elements.profileEmail.innerText = email;

        hideAllSections();
        if (elements.profileSection) elements.profileSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
    });

    // Edit Profile Logic
    document.getElementById('useCurrentProfileLocationBtn')?.addEventListener('click', () => {
        console.log("Use Location clicked. Protocol:", window.location.protocol, "Hostname:", window.location.hostname);
        
        // Browsers allow Geolocation on HTTPS OR Localhost
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isSecure = window.location.protocol === 'https:';

        if (!isSecure && !isLocalhost) {
            console.warn("Location blocked: Insecure Origin");
            alert("Location requires a secure connection (HTTPS) or Localhost. Since we are on a dev IP, please enter your location manually below.");
            return;
        }

        if (navigator.geolocation) {
            console.log("Requesting position...");
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                console.log("Position acquired:", lat, lon);
                if (elements.editLocation) elements.editLocation.value = `${lat}, ${lon}`;
            }, (err) => {
                console.error("Geolocation Error:", err);
                alert("Unable to retrieve location: " + err.message);
            });
        } else {
            console.warn("Geolocation not supported");
            alert("Geolocation is not supported by this browser.");
        }
    });

    elements.saveProfileBtn?.addEventListener('click', () => {
        if (currentUser) {
            currentUser.name = document.getElementById('editFamilyName').value;
            elements.profileFamilyName.innerText = currentUser.name;
            elements.profileDescription.innerText = document.getElementById('editDescription').value;
            elements.profileLocation.innerText = document.getElementById('editLocation').value;
            elements.profileChildrenAges.innerText = document.getElementById('editChildrenAges').value;
        }
        hideAllSections();
        elements.profileSection.style.display = 'block';
    });

    elements.logoutBtn?.addEventListener('click', () => {
        isAuthenticated = false;
        viewOnlyMode = false;
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
        });
    });

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
