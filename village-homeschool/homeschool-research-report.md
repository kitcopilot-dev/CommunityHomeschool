# Easy Peasy All-in-One Homeschool: Feature Analysis & Implementation Roadmap for Village

**Research Report | February 7, 2026**  
**Prepared for: Village Project Development**

---

## Executive Summary

This report analyzes Easy Peasy All-in-One Homeschool (allinonehomeschool.com) and its companion tracking site My EP Assignments (myepassignments.com). Easy Peasy is one of the most successful free homeschool curricula available, serving thousands of families worldwide with a complete K-12 curriculum. The insights gathered here can significantly inform Village's "Manage Kids" UI and Academic Dashboard development.

---

## 1. Key Findings: Features & Functionality

### 1.1 Grade Level Structure

**Multi-Tier Organization:**
- **Preschool & Kindergarten**: Pre-academic readiness and learn-to-read programs
- **Elementary (Grades 1-4)**: Core subjects with 180 daily lessons each
- **Middle School (Grades 5-8)**: Transition curriculum with increasing independence
- **High School (Grades 9-12)**: Separate site (allinonehighschool.com) with credit-bearing courses

**Flexible Placement System:**
- Placement tests for newcomers (Math, Reading, Language Arts)
- Mix-and-match capability (e.g., Math at grade 3, Reading at grade 5)
- No rigid grade-level locking—students advance at their own pace

### 1.2 Subject Organization

**Daily Subjects (180 lessons/year):**
- Math
- Language Arts
- Reading
- History/Geography
- Science
- Bible

**Weekly Subjects (36 lessons/year):**
- Art
- Music
- PE/Health
- Computer
- Thinking/Logic

### 1.3 Theme-Based Learning (Brilliant Concept!)

EP uses a 4-year rotating "Theme" system for History & Science:
1. **Ancient History** + Biology
2. **Early American History** + Zoology
3. **Geography & Cultures** + Earth Science
4. **Modern History** + Physics & Chemistry

**Why This Matters:** All children in a family study the same theme together, just at different depth levels (L1-4 for elementary, L5-8 for middle school). This enables family unity in learning while maintaining age-appropriate rigor.

### 1.4 Tracking System (My EP Assignments)

**Account Structure:**
- Family account supports up to 10 students
- Parent settings page with PIN protection option
- Per-child course selection and day tracking

**Daily Workflow:**
1. Student logs in and sees their personalized dashboard
2. Each subject shows a clickable assignment box
3. Click reveals the day's lesson content
4. "Needs Work" button changes to grading options when clicked
5. Parent marks day complete to advance to next lesson

**Progress Tracking:**
- Tracks current lesson number per course
- Points system for gamification
- Day counter (completed days)
- **Important:** EP explicitly does NOT keep records—parents are responsible for all recordkeeping

**What They Track:**
- Current lesson number per course per student
- Days completed
- Points earned

**What They DON'T Track (by design):**
- Grades/scores
- Time spent
- Detailed progress analytics
- Historical completion data

### 1.5 Content Delivery

**Lesson Format:**
- Each lesson is a webpage with numbered days (Lesson 1, Lesson 2, etc.)
- Instructions written directly to the student
- Links to external resources (videos, reading materials, worksheets)
- Embedded questions with hidden answers (highlight to reveal)
- Password-protected answer keys for parents

**Worksheets & Printables:**
- Asterisk (*) notation indicates printable worksheets
- Optional printables marked with (*)
- PDF packets available for bulk printing
- Physical workbooks available for purchase

---

## 2. What We Liked: Best Practices to Adopt

### 2.1 🌟 Simplicity First Philosophy
EP's motto is embedded in the name—"Easy Peasy." Everything is designed to reduce overwhelm:
- One lesson per day per subject
- Clear, consistent structure
- Minimal decision-making required once set up
- "Set it and forget it" course configuration

**Takeaway for Village:** Don't over-engineer. Parents are already stressed. Every feature should reduce cognitive load, not add to it.

### 2.2 🌟 Student Independence
Lessons are written TO the student, not about them:
- "Read chapter 1..."
- "Tell someone about what happened..."
- "Click here to watch the video..."

This enables students to work independently while parents supervise.

**Takeaway for Village:** Design the student-facing interface to speak directly to kids. They should be able to complete work without constant parent intervention.

### 2.3 🌟 Theme-Based Family Unity
The rotating theme system is genius for multi-child families:
- Everyone learns the same topic
- Age-appropriate depth levels
- Dinner table discussions become natural
- Parents only need to prep one subject area

**Takeaway for Village:** Consider implementing a "Family Learning Mode" where parents can align subjects across children.

### 2.4 🌟 Flexibility Without Chaos
Parents can:
- Mix grade levels across subjects
- Start mid-year at any lesson
- Move faster or slower than intended
- Switch courses without penalty

But there's still structure—180 lessons, clear subjects, defined scope.

**Takeaway for Village:** Build guardrails, not walls. Allow customization within sensible defaults.

### 2.5 🌟 Community-Driven Support
EP has 80+ Facebook groups organized by:
- State/Country
- Grade level
- Special needs
- Life situation (working parents, military, missionaries)
- Specific courses

**Takeaway for Village:** Consider building community features or integration points for parent networking.

### 2.6 🌟 Portfolio Reminders
Every 40 days, EP reminds students to collect work samples for their portfolio. This is built into the curriculum, not an afterthought.

**Takeaway for Village:** Automate portfolio collection prompts within the tracking system.

---

## 3. What Could Be Improved: Gaps We Can Fill

### 3.1 ❌ No Real Progress Analytics
EP tracks only lesson numbers and completed days. Parents can't see:
- Time spent per subject
- Accuracy/performance trends
- Struggle areas
- Pace relative to schedule
- Year-over-year growth

**Village Opportunity:** Build rich analytics dashboards showing:
- Time on task
- Completion rates
- Subject-by-subject progress
- Visual timelines
- Predictive "will they finish on time?" indicators

### 3.2 ❌ No Grade/Assessment Tracking (K-8)
EP has no built-in grading before high school. While philosophically intentional, many parents need grades for:
- State requirements
- Transfer to public school
- Personal peace of mind
- Student motivation

**Village Opportunity:** Optional grade tracking with:
- Flexible grading scales
- Auto-calculated GPAs
- Report card generation
- Grade trend visualizations

### 3.3 ❌ No Integrated Calendar
EP has 180 lessons but no calendar integration. Parents must mentally map:
- Start dates
- Holiday breaks
- Vacation gaps
- End date projections

**Village Opportunity:** Smart calendar integration:
- Set start date + school days per week
- Auto-schedule lessons
- Drag-and-drop rescheduling
- Visual calendar view
- Sync with family calendars

### 3.4 ❌ No Multi-Child Dashboard
EP requires switching between student accounts to see each child's status. No unified parent view.

**Village Opportunity:** Family command center showing:
- All children at a glance
- Who's behind/ahead
- Today's assignments for everyone
- Quick actions per child

### 3.5 ❌ No Offline/Mobile-First Experience
EP is website-only. The mobile experience is functional but not optimized.

**Village Opportunity:** Progressive web app or native app with:
- Offline lesson viewing
- Push notifications
- Mobile-optimized interface
- Quick completion marking

### 3.6 ❌ No Curriculum Flexibility
EP is all-or-nothing. You use their curriculum or you don't.

**Village Opportunity:** Curriculum-agnostic tracking:
- Support EP-style structured curriculum
- Support custom curriculum
- Support hybrid approaches
- Import from multiple sources

### 3.7 ❌ No Attendance/Hours Tracking
Many states require attendance logs or hours. EP doesn't provide this.

**Village Opportunity:** Built-in attendance and time logging:
- Clock in/out for lessons
- Daily attendance marking
- Hours-per-subject reporting
- State requirement templates

### 3.8 ❌ No Document Storage
EP reminds parents to keep portfolios but provides no storage.

**Village Opportunity:** Integrated document/media storage:
- Photo uploads of work
- PDF worksheet storage
- Voice recording of readings
- Video of presentations

---

## 4. Implementation Roadmap for Village

### Phase 1: Foundation (Core Tracking MVP)

**Goal:** Replicate EP's core value proposition but better

| Feature | Description | Priority |
|---------|-------------|----------|
| **Multi-Child Family Accounts** | Support 10+ children per family | Critical |
| **Course/Subject Setup** | Add subjects with lesson counts | Critical |
| **Daily Lesson Tracking** | Mark lessons complete, auto-advance | Critical |
| **Parent Dashboard** | See all kids at a glance | Critical |
| **Student Dashboard** | See today's assignments | Critical |
| **Flexible Lesson Numbers** | Mix-and-match grade levels per subject | High |

**Manage Kids UI Elements:**
- Add child → Name, birthdate, optional photo
- Assign subjects → Select from library or create custom
- Set current lesson → Manual override capability
- View progress → Simple progress bar per subject

### Phase 2: Smart Scheduling

**Goal:** Solve EP's biggest gap—calendar integration

| Feature | Description | Priority |
|---------|-------------|----------|
| **School Year Setup** | Define start date, end date, days per week | Critical |
| **Holiday Calendar** | Mark off breaks, auto-adjust schedule | High |
| **Lesson Scheduling** | Auto-calculate which lesson on which day | High |
| **Behind/Ahead Indicator** | Visual status vs. expected pace | High |
| **Reschedule Assistant** | "We took a week off—recalculate" | Medium |

**Academic Dashboard Elements:**
- Calendar view with lesson mapping
- Today's lessons highlighted
- "Catch-up mode" suggestions
- Year completion projection

### Phase 3: Assessment & Analytics

**Goal:** Provide the analytics EP deliberately omits

| Feature | Description | Priority |
|---------|-------------|----------|
| **Optional Grading** | Parents can assign grades per lesson | High |
| **Grade Calculations** | Auto GPA, weighted averages | Medium |
| **Progress Charts** | Visual completion over time | High |
| **Subject Comparisons** | Side-by-side subject progress | Medium |
| **Report Card Generator** | Printable/PDF report cards | Medium |
| **Attendance Logging** | Mark days attended, track hours | High |

**Academic Dashboard Elements:**
- Grade trends graph
- Subject-by-subject breakdown
- Attendance summary
- "This Week" quick stats

### Phase 4: Portfolio & Documentation

**Goal:** Solve the documentation burden

| Feature | Description | Priority |
|---------|-------------|----------|
| **Work Sample Uploads** | Photo/PDF per lesson | High |
| **Portfolio Reminders** | Every 40 days, prompt collection | Medium |
| **Auto-Organized Portfolio** | By subject, by quarter | High |
| **Export Portfolio** | PDF book or zip download | Medium |
| **Transcript Generator** | High school transcript creation | Medium |

### Phase 5: Advanced Features

**Goal:** Differentiate from any competitor

| Feature | Description | Priority |
|---------|-------------|----------|
| **Theme/Topic Alignment** | Family learns together mode | Medium |
| **Curriculum Marketplace** | Import structured curricula | Medium |
| **Student Login** | Kids see their own dashboard | High |
| **Gamification** | Points, badges, streaks | Low |
| **Mobile App** | Native iOS/Android | Medium |
| **Collaborative Planning** | Multi-parent access | Low |

---

## 5. Recommended Data Model (High-Level)

```
Family
├── Parents[]
│   ├── name
│   ├── email
│   └── role (admin/viewer)
│
├── Children[]
│   ├── name
│   ├── birthdate
│   ├── gradeLevel (optional)
│   ├── Enrollments[]
│   │   ├── subject
│   │   ├── curriculum (optional)
│   │   ├── totalLessons
│   │   ├── currentLesson
│   │   ├── startDate
│   │   └── Completions[]
│   │       ├── lessonNumber
│   │       ├── completedDate
│   │       ├── grade (optional)
│   │       ├── timeSpent (optional)
│   │       └── notes (optional)
│   │
│   └── Attendance[]
│       ├── date
│       └── hoursLogged
│
└── Settings
    ├── schoolDaysPerWeek
    ├── yearStartDate
    ├── yearEndDate
    └── holidays[]
```

---

## 6. Summary & Next Steps

### What EP Does Brilliantly:
- Simple, consistent daily structure
- Student independence through direct instruction
- Family unity via theme-based learning
- Flexibility within structure
- Strong community support

### What Village Can Do Better:
- Rich progress analytics
- Integrated calendar scheduling
- Multi-child unified dashboard
- Grade and attendance tracking
- Portfolio documentation
- Mobile-first experience
- Curriculum-agnostic flexibility

### Recommended First Sprint:
1. Multi-child family account structure
2. Subject/course setup with lesson counts
3. Daily completion tracking with auto-advance
4. Parent dashboard showing all children
5. Simple progress indicators (% complete)

This foundation matches EP's core value while setting up for the enhancements they lack.

---

*Report prepared by Pi (OpenClaw AI Assistant)*  
*Research conducted: February 7, 2026*
