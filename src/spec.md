# Specification

## Summary
**Goal:** Build a complete hospital management application with admin authentication, emergency SOS with department routing, patient records, doctor assignments, and comprehensive case tracking.

**Planned changes:**
- Replace blockchain-focused backend with hospital management data model (patients, emergency cases, doctors, departments, case assignments)
- Implement admin authentication system using Internet Identity with authorized admin principals
- Create admin dashboard displaying all cases with patient info, addresses, assigned doctors, status, and department filters
- Add doctor management view organized by department showing case assignments and workloads
- Enhance Emergency SOS feature with department selection dropdown (Emergency, Cardiology, Neurology, Pediatrics, Orthopedics, etc.)
- Replace blockchain UI with hospital management interface including patient-facing SOS form and admin sections
- Implement backend API methods for case creation, doctor assignment, status updates, and admin data retrieval with authentication checks
- Fix all UI functionality including toggles, sign-in, form submissions, and data fetching with proper error handling

**User-visible outcome:** Users can submit emergency cases with department selection and personal information. Admins can authenticate, view all cases filtered by status or department, manage doctor assignments organized by specialty, and track complete case details including patient addresses and processing history in a fully functional hospital management system.
