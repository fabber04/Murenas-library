Product Requirements & User Stories
==================================

Vision
------
Provide students with a centralized portal for academics, campus information, security reporting, and sports updates, with an admin back office to manage content and respond to reports.

Personas
--------
- **Student**: consumes content and downloads materials; submits security reports.
- **Admin**: manages content, uploads materials, reviews and triages reports.
- **Contributor (optional)**: lecturers/security/sports reps who can manage scoped content.

High-Level Requirements
-----------------------
- **Academics**: view academic calendar, exam timetable, registration notices, current SRC.
- **Information**: enquiry desk (FAQ/contact form), campus updates/announcements, venues directory.
- **Exam Material**: browse/search and download textbooks, notes, exam papers, solutions.
 - **Exam Material**: browse/search and download textbooks, notes, exam papers, solutions; students can submit notes/materials for review.
- **Security**: submit reports (abuse/theft) with optional attachments; admin review workflow.
- **Sports**: view venues, coaches/captains contacts, competition dates.
- **Admin**: CRUD for all content; moderate and resolve security reports; upload files.
- **Moderation**: public-submitted materials (no login) enter a review queue before publication.

Non-Functional Requirements
---------------------------
- **Usability**: mobile-first, accessible (WCAG AA), fast navigation and search.
- **Performance**: ≤200ms p95 API latency; paginate lists; CDN for files.
- **Security**: role-based access; file scanning; CAPTCHA; rate limiting; audit logs for admin actions.
- **Trust & Safety**: content moderation queue, abuse reporting on materials, takedown within SLA; IP logging for abusive uploads.
- **Reliability**: daily backups for DB and object storage; error monitoring.

User Stories (MVP)
------------------
- As a student, I can view the academic calendar so I can plan my semester.
- As a student, I can search exam materials by course/semester to find what I need.
- As a student, I can report theft/abuse and upload a photo so security can act.
- As an admin, I can publish an announcement visible on the homepage.
- As an admin, I can upload a PDF of exam papers and tag it by course and year.
- As an admin, I can review new security reports, change status, and leave notes.
- As anyone, I can upload study notes (PDF/images) tagged to a course and year without creating an account.
 - As an admin, I can approve/reject student material submissions with feedback.

Out of Scope (initial)
----------------------
- SSO/portal integration, push notifications, payments, complex LMS features.

Acceptance Criteria (samples)
-----------------------------
- Announcements list loads ≤1s with 50 items (paginated).
- File uploads accept PDF/JPG/PNG up to 25MB; virus scan passes.
 - Student uploads remain hidden until approved; upon approval they are visible in Materials.
- Security report submission works anonymously (optional contact field) and returns a ticket ID.


