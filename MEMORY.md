# MEMORY.md

## System Status
- **Google Workspace (gog)**: Fully authenticated as `kit.copilot@gmail.com`. Gmail and Calendar APIs are enabled and working.

## Ongoing Tasks
- Monitoring `kittcopilot@agentmail.to` via heartbeat.
- Monitoring `kit.copilot@gmail.com` via heartbeat.
- Daily Usage Report scheduled for 05:00 UTC.
- Daily Homeschool Assignments scheduled for 09:00 AM (America/Chicago), Mon-Fri.
- **Village Project**: Moved to `village-homeschool/` subfolder. Roadmap and feature implementation plans tracked in [village-homeschool/VILLAGE_PROJECT.md](village-homeschool/VILLAGE_PROJECT.md).
- **Manage Kids UI**: Continuing implementation of standalone management interface. Built `manage_kids.html` with dashboard and "Vault" views.

## Decisions
- **2026-02-06**: Tabled Lesson Plan Development part to focus on Manage Kids UI as per Justin's request.
- **2026-02-06**: Preferences updated: Future assignments should mimic the original clean HTML layout (e.g., `homeschool/2026-02-05/13yo.html`) but be delivered as PDFs. PDFs must use color but retain a white background for printing.

## System Capabilities
- **exe-platform skill**: Kitt has orchestrator access to manage VMs, network ports, and email routing on the exe.dev platform.
- **frontend-design skill**: Kitt can create distinctive, high-quality production-grade interfaces avoiding generic AI aesthetics.
