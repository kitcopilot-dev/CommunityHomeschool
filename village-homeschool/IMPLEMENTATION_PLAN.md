# Village Homeschool: Bug Report & PocketBase Implementation Plan

**Date:** February 7, 2026  
**Author:** Kitt (OpenClaw AI Assistant)

---

## Part 1: Bug Report & Issues Found

### 🔴 Critical Issues

#### 1. **No Backend — All Data Lost on Session Clear**
- **Location:** `parent-portal.js`, `manage-kids.js`
- **Problem:** All user data (accounts, kids, courses, events, assignments) is stored in `sessionStorage`, which is wiped when the browser tab closes or session expires.
- **Impact:** Users lose ALL their data. This is unusable for any real homeschool tracking.
- **Fix:** Migrate to PocketBase for persistent storage.

#### 2. **Passwords Stored in Plain Text**
- **Location:** `parent-portal.js` line 10-14
- **Problem:** User passwords are stored as plain strings in `sessionStorage` and compared directly.
- **Impact:** Major security vulnerability.
- **Fix:** Use PocketBase's built-in auth which handles password hashing.

#### 3. **No Real Authentication**
- **Location:** `parent-portal.js` lines 95-115
- **Problem:** "Authentication" is just checking if email/password matches a hardcoded array. No tokens, no session management, no security.
- **Impact:** Anyone can bypass auth; no real user accounts exist.
- **Fix:** Implement PocketBase `authWithPassword()` and token-based sessions.

---

### 🟡 Functional Bugs

#### 4. **"Edit Profile" Button Does Nothing for Kids**
- **Location:** `manage-kids.js` line 70-74
- **Problem:** The edit button (pencil icon) on kid cards has no event listener attached.
- **Impact:** Users cannot edit child profiles after creation.
- **Fix:** Add edit modal and handler.

#### 5. **Delete Child Not Implemented**
- **Location:** `manage-kids.js`
- **Problem:** No way to remove a child from the family.
- **Impact:** Users stuck with test data or mistakes.
- **Fix:** Add delete confirmation and handler.

#### 6. **Delete Course Not Implemented**
- **Location:** `manage-kids.js`
- **Problem:** Courses can be added but never removed.
- **Impact:** Users cannot fix mistakes in course setup.
- **Fix:** Add delete button to course cards.

#### 7. **Academic Dashboard Not Connected to Kids Data**
- **Location:** `parent-portal.js` - `dashboardSection`
- **Problem:** The dashboard exists but doesn't pull from `village_kids` data. Shows static placeholder content.
- **Impact:** Dashboard is useless; doesn't reflect actual child progress.
- **Fix:** Wire dashboard to aggregate data from all children's courses.

#### 8. **Assignments Not Linked to Children**
- **Location:** `parent-portal.js` - `createAssignmentSection`
- **Problem:** Assignment creation has no child selector. Assignments go into a void.
- **Impact:** Can't track which child completed which work.
- **Fix:** Add child selector dropdown; link assignments to specific kids.

#### 9. **Transcript Generator Non-Functional**
- **Location:** `parent-portal.js` - `transcriptSection`
- **Problem:** "View Transcript" button shows empty template; no data population.
- **Impact:** Feature is broken.
- **Fix:** Generate transcript from child's completed courses/assignments.

#### 10. **Events Don't Persist Across Devices**
- **Location:** `parent-portal.js` - events stored in `sessionStorage`
- **Problem:** Community events only exist on the device/session that created them.
- **Impact:** Defeats purpose of "community" features.
- **Fix:** Store events in PocketBase with proper sharing/visibility.

#### 11. **Password Confirmation Not Validated**
- **Location:** `parent-portal.js` - registration handler
- **Problem:** `registerConfirmPassword` field exists but is never checked against `registerPassword`.
- **Impact:** Users can register with mistyped passwords.
- **Fix:** Add validation before registration.

#### 12. **Supply List Feature Incomplete**
- **Location:** `index.html` - `suppliesSection`
- **Problem:** UI for adding supplies to events exists, but data is never saved or displayed.
- **Impact:** Supply coordination doesn't work.
- **Fix:** Save supplies array with event; render in event cards.

---

### 🟢 Minor Issues / Polish

#### 13. **Logout Button Hidden Initially on manage_kids.html**
- **Location:** `manage_kids.html` line 23
- **Problem:** Logout button is `display: none` but never shown even when authenticated.
- **Impact:** Users can't logout from Manage Kids page.
- **Fix:** Check auth state and show/hide appropriately.

#### 14. **Legal Guides Filter/Search Not Working**
- **Location:** `parent-portal.js` - `loadLegalGuides()`
- **Problem:** Search input and filter dropdown exist but have no event handlers.
- **Impact:** Users can't filter 50 states by name or regulation level.
- **Fix:** Add filter logic.

#### 15. **Legal Stats Counts Not Calculated**
- **Location:** `parent-portal.js` - `legalCountLow/Mod/High` elements
- **Problem:** Stats badges show "0" for all regulation levels.
- **Impact:** Summary stats are broken.
- **Fix:** Calculate counts during `loadLegalGuides()`.

#### 16. **"My State" Banner Never Shows**
- **Location:** `index.html` - `myStateHighlight`
- **Problem:** Logic to detect user's state from profile location exists but banner is never populated.
- **Impact:** Personalization feature broken.
- **Fix:** Parse user location, match to state, show banner.

#### 17. **Distance/Radius Filter Has No Effect**
- **Location:** Events filter section
- **Problem:** UI exists for distance filtering but no geospatial calculation implemented.
- **Impact:** Feature is decorative only.
- **Fix:** Low priority; defer until events have real geo data.

---

## Part 2: PocketBase Implementation Plan

### Prerequisites
- **PocketBase Instance URL:** `https://bear-nan.exe.xyz/` ✅
- **Existing Collections:** `users`, `profiles`, `events`, `event_registrations` ✅
- **Collections to Add:** `children`, `courses`

---

### Phase 1: PocketBase SDK Setup

**Files to Create:**
```
village-homeschool/
├── src/
│   ├── pb.js              # PocketBase client singleton
│   ├── auth.js            # Auth helpers (login, register, logout, getUser)
│   └── api/
│       ├── families.js    # Family CRUD
│       ├── children.js    # Children CRUD
│       ├── courses.js     # Course tracking
│       ├── events.js      # Community events
│       └── assignments.js # Academic records
```

**pb.js (PocketBase Client):**
```javascript
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://YOUR_POCKETBASE_URL');

// Auto-refresh auth on load
pb.authStore.onChange(() => {
    console.log('Auth state changed:', pb.authStore.isValid);
});

export default pb;
```

---

### Phase 2: Database Schema (PocketBase Collections)

#### Existing Collections (Already Set Up ✅)
- `users` - Built-in auth collection
- `profiles` - Extended user profile data
- `events` - Community gatherings
- `event_registrations` - RSVP tracking

#### Collections to Create in PocketBase Admin

##### `children` (NEW - create this)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| user | relation → users | Yes | Owner of this child record |
| name | text | Yes | Child's full name |
| age | number | Yes | Current age |
| grade | text | No | Grade level (e.g., "3rd Grade") |
| focus | text | No | Current learning focus |

**API Rules for `children`:**
- List/Search: `@request.auth.id != "" && user = @request.auth.id`
- View: `@request.auth.id != "" && user = @request.auth.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != "" && user = @request.auth.id`
- Delete: `@request.auth.id != "" && user = @request.auth.id`

##### `courses` (NEW - create this)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| child | relation → children | Yes | Which child this course belongs to |
| name | text | Yes | Course name (e.g., "Math", "History") |
| total_lessons | number | Yes | Total lessons in course (default: 180) |
| current_lesson | number | Yes | Current lesson number (default: 1) |
| start_date | date | No | When this course started |

**API Rules for `courses`:**
- List/Search: `@request.auth.id != "" && child.user = @request.auth.id`
- View: `@request.auth.id != "" && child.user = @request.auth.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != "" && child.user = @request.auth.id`
- Delete: `@request.auth.id != "" && child.user = @request.auth.id`

---

### Phase 3: Migration Order

#### Sprint 1: Auth (Priority: Critical)
1. Create `pb.js` with PocketBase URL
2. Implement `auth.js`:
   - `register(email, password, familyName)`
   - `login(email, password)`
   - `logout()`
   - `getCurrentUser()`
   - `isAuthenticated()`
3. Update `parent-portal.js` to use real auth
4. Add proper error handling for auth failures
5. Implement token persistence (localStorage for "remember me")

**Estimated Effort:** 4-6 hours

#### Sprint 2: Family & Children Data
1. Create `families.js` API module
2. Create `children.js` API module
3. Migrate `manage-kids.js` from sessionStorage to PocketBase
4. Implement child CRUD (Create, Read, Update, Delete)
5. Link children to authenticated user's family

**Estimated Effort:** 4-6 hours

#### Sprint 3: Course Tracking
1. Create `courses.js` API module
2. Migrate course data from sessionStorage
3. Implement lesson progress sync
4. Add real-time progress updates
5. Wire dashboard stats to aggregated course data

**Estimated Effort:** 3-4 hours

#### Sprint 4: Events & Community
1. Create `events.js` API module
2. Migrate events from sessionStorage
3. Implement event CRUD with proper ownership
4. Add RSVP/attendance tracking
5. Implement supply claims

**Estimated Effort:** 4-6 hours

#### Sprint 5: Assignments & Transcripts
1. Create `assignments.js` API module
2. Link assignments to specific children
3. Populate dashboard with real assignment data
4. Generate transcripts from stored records
5. Add print/PDF export for transcripts

**Estimated Effort:** 4-6 hours

---

### Phase 4: Immediate Bug Fixes (Pre-PocketBase)

These can be fixed now without waiting for PocketBase:

| Bug # | Fix | Effort |
|-------|-----|--------|
| 4 | Add edit child modal/handler | 1 hour |
| 5 | Add delete child button/confirm | 30 min |
| 6 | Add delete course button | 30 min |
| 11 | Validate password confirmation | 15 min |
| 13 | Show logout on manage_kids.html | 15 min |
| 14-16 | Fix legal guides filters/stats | 1 hour |

**Total Quick Wins:** ~3.5 hours

---

## Summary

### Critical Path
1. Get PocketBase URL from Justin
2. Set up PocketBase SDK
3. Migrate auth first (biggest pain point)
4. Migrate children/courses (core feature)
5. Events and assignments can follow

---

## ✅ Completed Actions (Feb 7, 2026)

### PocketBase Setup
- **URL:** `https://bear-nan.exe.xyz/`
- **Status:** Running, healthy

### Collections Verified
| Collection | Status | Notes |
|------------|--------|-------|
| users | ✅ Exists | Built-in auth |
| profiles | ✅ Exists | family_name, description, location, children_ages |
| events | ✅ Exists | title, description, event_date, event_time, location, creator |
| event_registrations | ✅ Exists | event, user relations |
| children | ✅ Created | user, name, age, grade, focus |
| courses | ✅ Created | child, name, total_lessons, current_lesson, start_date |

### API Modules Created
- `src/pb.js` - PocketBase client singleton
- `src/auth.js` - Login, register, logout, profile management
- `src/api/children.js` - CRUD for child records
- `src/api/courses.js` - Course tracking with progress stats
- `src/api/events.js` - Event CRUD + registrations

### Next Step
Wire the frontend (`parent-portal.js`, `manage-kids.js`) to use these API modules instead of sessionStorage.

---

*Report generated by Kitt • February 7, 2026*
