# Specification

## Summary
**Goal:** Add role-based access codes for doctor registration and admin login, department-based filtering for doctors, a read-only admin dashboard, and a floating customer support button on every page.

**Planned changes:**
- Add a `registrationCode` field to doctor profiles in the backend; reject registration if code is not `2011`
- Store the doctor's selected department (from a fixed list of 15) on their profile in the backend
- Update admin authentication to use hardcoded passcode `1107` with read-only access to all doctors and cases
- Update the doctor registration form to include a security code input field and a department dropdown (15 fixed departments: Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, Radiology, Oncology, Psychiatry, Gastroenterology, Urology, ENT, Ophthalmology, Gynecology, General Surgery, Emergency Medicine)
- After login, filter the doctor dashboard to only show cases matching their department
- Update AdminPortal to authenticate with passcode `1107` and display all doctor profiles (name, department, availability) and all cases across departments in read-only mode with no add/edit/delete controls
- Add a floating circular `SupportButton` component fixed to the bottom-right of every page, with a support icon, tooltip/aria-label "Customer Support", and a `mailto:satyamjha2553@gmail.com` link on click

**User-visible outcome:** Doctors must enter code `2011` and select a department to register, then see only their department's cases after login. Admins log in with code `1107` and view all doctors and cases in read-only mode. A floating support button is visible on every page, opening an email to the support address when clicked.
