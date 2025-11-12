Data Model
==========

Entities
--------
- **User** (students, admins, contributors)
  - id, name, email, role (student|admin|contributor), password_hash, created_at, updated_at
- **Announcement**
  - id, title, body, section (academics|info|sports), starts_at, ends_at, created_by
- **CalendarEvent**
  - id, title, description, starts_at, ends_at, category (academic|competition), venue_id
- **Venue**
  - id, name, address, description, contacts[]
- **Contact**
  - id, name, role (coach|captain|src), phone, email, team/department
- **Course**
  - id, code, name, department
- **Material**
  - id, type (textbook|notes|exam_paper|solution), course_id, year, title, file_url, file_size, checksum, uploaded_by, created_at
  - source (admin|student), submission_id (nullable)
- **MaterialSubmission** (public uploads)
  - id, student_id (nullable), contact_email (nullable), ip_hash, type (notes|solution|other), course_id, year, title, file_url, status (pending|approved|rejected), reviewer_id, review_note, created_at, updated_at
- **SecurityReport**
  - id, kind (abuse|theft), description, location_text, attachment_url, reporter_contact (nullable), status (new|in_review|resolved|rejected), assignee_id, created_at, updated_at
- **AuditLog**
  - id, actor_id, action, entity, entity_id, before, after, created_at

Notes
-----
- Files stored in object storage (S3-compatible). `file_url` references a signed path.
- `Announcement.section` maps to top-level areas: Academics, Information, Sports.
- Security reports can be submitted anonymously; `reporter_contact` optional.

Indexes
-------
- `Material`: (course_id, year, type), full-text on title.
- `SecurityReport`: status, created_at.
- `CalendarEvent`: starts_at.
- `MaterialSubmission`: status, created_at, ip_hash.

Relationships
-------------
- `Course` 1—* `Material`
- `Venue` 1—* `CalendarEvent`
- `User` 1—* `Announcement` (created_by)
- `User` 1—* `SecurityReport` (assignee)
 - `User` 1—* `Material` (uploaded_by)
 - `User` 1—* `MaterialSubmission` (student_id)
 - `MaterialSubmission` 1—1 `Material` (upon approval)


