// Standard JS (non-module) for better compatibility
function initParentPortal(elements) {
    if (!elements) return;

    // Configuration
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.startsWith('100.') || 
                  window.location.hostname.includes('how-november') ||
                  window.location.hostname === '44.240.253.236' ||
                  window.location.port === '8000';
    
    console.log("Village Portal Initialized. Hostname:", window.location.hostname, "Dev Mode:", isDev);
    
    let isAuthenticated = false;

    function hideAllSections() {
        [elements.authSection, elements.profileSection, elements.editProfileSection, 
         elements.eventsSection, elements.dashboardSection, elements.legalGuidesSection, elements.legalDetailSection]
        .forEach(s => { if(s) s.style.display = 'none'; });
    }

    function checkAuth(callback) {
        if (isDev || isAuthenticated) {
            callback();
        } else {
            alert("Please login to access this functional part of the app.");
            hideAllSections();
            elements.authSection.style.display = 'block';
        }
    }

    // Public Sections (Accessible without Auth)
    elements.viewLegalGuidesBtn?.addEventListener('click', () => {
        hideAllSections();
        if (elements.legalGuidesSection) elements.legalGuidesSection.style.display = 'block';
        loadLegalGuides();
    });

    elements.backFromLegalBtn?.addEventListener('click', () => {
        hideAllSections();
        if (isAuthenticated) {
            elements.profileSection.style.display = 'block';
        } else {
            elements.authSection.style.display = 'block';
        }
    });

    // Authenticated Sections
    elements.loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Login button clicked");
        const email = elements.loginEmail?.value;
        const password = elements.loginPassword?.value;

        if (isDev && !email && !password) {
            isAuthenticated = false; 
            elements.profileFamilyName.innerText = 'Guest (View Only Mode)';
        } else {
            isAuthenticated = true;
            elements.profileFamilyName.innerText = 'The Lynch Family';
        }

        hideAllSections();
        if (elements.profileSection) elements.profileSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'block';
        if (elements.profileEmail) elements.profileEmail.innerText = email || 'guest@village.com';
    });

    elements.logoutBtn?.addEventListener('click', () => {
        isAuthenticated = false;
        hideAllSections();
        if (elements.authSection) elements.authSection.style.display = 'block';
        if (elements.logoutBtn) elements.logoutBtn.style.display = 'none';
    });

    elements.manageKidsBtn?.addEventListener('click', () => {
        checkAuth(() => {
            window.location.href = 'manage_kids.html';
        });
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

    elements.registerBtn?.addEventListener('click', () => {
        elements.loginBtn?.click();
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

// Support for Vitest
if (typeof exports !== 'undefined') {
    module.exports = { initParentPortal };
}
