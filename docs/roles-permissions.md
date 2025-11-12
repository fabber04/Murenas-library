Roles & Permissions
===================

Roles
-----
- **Public/Student**
  - Browse/download materials, announcements, events, venues
  - Submit security reports
  - Submit study materials (notes/solutions) for moderation without login
- **Contributor** (optional, scoped)
  - Manage content in assigned scope (e.g., sports contacts, course materials)
  - Cannot change roles or system settings
- **Admin**
  - Full CRUD on all content, venues, contacts, courses
  - Review/approve/reject student submissions
  - Manage security reports and assignments
  - Manage users (promote/demote contributors)
  - View audit logs and system settings

Moderation Workflow (Student Uploads)
------------------------------------
1) Student uploads a submission -> status `pending`.
2) Admin reviews: approve -> publish as `Material` and link back to submission; reject -> stays hidden with `review_note`.
3) All actions are logged in `AuditLog`.

 Security & Rate Limits
 ----------------------
 - File scanning on upload; max size 25MB; allowed types: PDF, JPG, PNG.
 - CAPTCHA + IP-based rate limits for public submissions; optional per-user limits if logged in.
 - Takedown flow: admins can unpublish materials and record reason.


