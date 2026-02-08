# Village Homeschool Project Documentation

## Project Overview
**Village** is a handcrafted, organic learning portal designed to help homeschooling families manage their children's educational journeys with ease and beauty. It prioritizes simplicity, student independence, and family unity.

## Research Foundations: Easy Peasy (EP) Analysis
Based on research conducted on February 7, 2026, Village adopts and improves upon successful patterns from the "Easy Peasy All-in-One Homeschool" curriculum.

### Core Philosophy Adoptions
- **Simplicity First**: Reducing cognitive load for parents with clear, consistent daily structures.
- **Student Independence**: Direct instruction to the student (e.g., "Read chapter 1...") rather than just for the parent.
- **Family Unity (Theme-Based)**: Aligning subjects like History and Science across different ages so the family learns together at appropriate depths.
- **Flexibility**: Allowing mix-and-match grade levels across different subjects.

### Village Competitive Edge (Planned Enhancements)
Unlike traditional tools, Village aims to fill several gaps identified in current free offerings:
1. **Smart Analytics**: Visual dashboards showing time-on-task, completion rates, and subject-by-subject progress.
2. **Integrated Calendar**: Auto-scheduling 180-day curricula based on the family's real-world holiday and break schedule.
3. **Unified Parent Command Center**: A single view to manage all children without account switching.
4. **Automated Documentation**: Integrated portfolio storage (photos/PDFs) and attendance logging for state compliance.

---

## Feature Roadmap

### Phase 1: Foundation (Current Focus)
- [x] Multi-child family profile management
- [x] Organic, premium UI design (Sage & Terracotta aesthetic)
- [x] Basic "Learning Vault" for resource tracking
- [x] Subject/Course setup with lesson counts
- [x] Daily completion tracking with auto-advance

### Phase 2: Smart Scheduling
- [x] Course "Active Days" selection (e.g., Tue/Thu only)
- [x] Daily filtering in Weekly Schedule
- [x] School year calendar setup (start/end dates, holiday breaks)
- [x] School days calculation (weekdays minus breaks)
- [ ] Automatic lesson-to-date mapping
- [ ] "Behind/Ahead" visual indicators
- [ ] Drag-and-drop rescheduling assistant

### Phase 3: Assessment & Analytics
- [x] Family-wide dashboard stats
- [x] Recent activity feed
- [x] GPA calculations (per-child, 0.0-4.0 scale)
- [x] Subject averages across all assignments
- [x] Grade distribution visualization (A/B/C/D/F)
- [x] Academic transcript generator with PDF export
- [ ] Attendance logging and hours-per-subject reporting

### Phase 4: Portfolio & Documentation
- [x] Photo/PDF uploads for work samples per lesson
- [ ] Automated portfolio prompts (every 40 lessons)
- [ ] Exportable portfolio "Yearbook" (PDF)
- [ ] State-compliant attendance log export

---

## Technical Architecture
- **Core**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom Design System (variables in `src/style.css`)
- **Fonts**: `Syne` (Display), `Fraunces` (Serif accents), `Inter` (Body)
- **State Management**: Local browser storage (current) / Backend API (future)
- **Testing**: Vitest with JSDOM

## Directory Structure
- `/homeschool`: Generated lesson plans and assignments
- `/src`: Core application logic and styles
- `/tests`: Automated verification suite
- `manage_kids.html`: The child/profile management interface
- `index.html`: Parent Home / Portal Entry
