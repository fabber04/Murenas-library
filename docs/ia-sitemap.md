Information Architecture & Sitemap
=================================

Top-Level Navigation
--------------------
- Home (Announcements, quick links)
- Academics
- Information
- Exam Material
- Security
- Sports
- Admin (protected)

Pages & Content Blocks
----------------------
- **Home**
  - Hero + latest announcements (all sections)
  - Quick links: Calendar, Exam Timetable, Upload Notes, Report Incident

- **Academics**
  - Calendar (list and month view)
  - Exam Timetable (filter by semester/department)
  - Registration Notices
  - Current SRC (contacts)

- **Information**
  - Enquiry Desk (FAQ + contact form)
  - Updates/Announcements
  - Venues directory (map/list)

- **Exam Material**
  - Browse (filters: course, year, type)
  - Detail page (metadata + download)
  - Submit Notes (student upload form)

- **Security**
  - Report Abuse/Theft (form with optional attachment)
  - After submit: ticket ID and guidance

- **Sports**
  - Venues
  - Coaches & Captains contacts
  - Competition dates (events)

- **Admin**
  - Dashboard (KPIs: submissions pending, reports new)
  - Announcements CRUD
  - Events & Venues CRUD
  - Courses & Materials CRUD
  - Student Submissions queue (review/approve/reject)
  - Security Reports inbox (triage/assign/resolve)
  - Contacts (SRC/Coach/Captain)
  - Users & Roles, Audit Log

URL Scheme (suggested)
----------------------
- /
- /academics, /academics/calendar, /academics/exams, /academics/notices, /academics/src
- /info, /info/enquiry, /info/updates, /info/venues
- /materials, /materials/:id, /materials/submit
- /security/report
- /sports, /sports/venues, /sports/contacts, /sports/competitions
- /admin/* (protected)


