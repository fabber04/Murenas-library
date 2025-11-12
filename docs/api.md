API Specification (Draft)
=========================

Auth
----
- POST /auth/login — email/password -> token (admin/contributor)
- POST /auth/logout — invalidate token
- (Optional) POST /auth/register — create student account (not required for uploads)

Announcements
-------------
- GET /announcements?section=academics|info|sports&page&limit
- POST /announcements (admin)
- PATCH /announcements/:id (admin)
- DELETE /announcements/:id (admin)

Calendar & Venues
-----------------
- GET /events?category=academic|competition&from&to&venue_id
- POST /events (admin)
- GET /venues
- POST /venues (admin)

Courses & Materials
-------------------
- GET /courses?query
- POST /courses (admin)
- GET /materials?course_id&year&type&query&page&limit
- POST /materials (admin) multipart: file, title, course_id, year, type
- GET /materials/:id — metadata
- GET /materials/:id/file — signed URL redirect
- DELETE /materials/:id (admin)

- Student Material Submissions
-----------------------------
- POST /materials/submissions — (public) multipart: file, title, course_id, year, type, captcha_token, contact_email (optional)
- GET /materials/submissions (admin) — filters: status, course_id, type
- PATCH /materials/submissions/:id (admin) — approve/reject with review_note

Security Reports
----------------
- POST /security/reports — { kind, description, location_text, attachment } (optional contact)
- GET /security/reports (admin) — filters: status, kind, date range
- PATCH /security/reports/:id — { status, assignee_id, internal_note } (admin)

Contacts (SRC, Coaches, Captains)
---------------------------------
- GET /contacts?role=src|coach|captain
- POST /contacts (admin)
- PATCH /contacts/:id (admin)

Conventions
-----------
- Pagination: `page` (1-based), `limit` (default 20), response includes `total`.
- Errors: RFC7807-style `{ type, title, status, detail, instance }`.
- Auth: Bearer JWT; all admin/contributor routes require token.
- Public uploads do not require auth but must pass CAPTCHA and rate limits; approved submissions are promoted to `Material`.


