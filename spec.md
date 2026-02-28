# Specification

## Summary
**Goal:** Fix the doctor registration flow so that newly registered doctors see their generated credentials before being redirected to the login page, rather than being sent directly to the dashboard.

**Planned changes:**
- After successful doctor registration, display a confirmation screen/modal showing the generated Registration ID and Code prominently.
- Add a copy button or "I have saved these credentials" acknowledgement button on the confirmation screen.
- After the doctor acknowledges their credentials, redirect them to the DoctorPortal login form instead of the dashboard.
- Remove any automatic post-registration redirect to the doctor dashboard.
- Ensure the doctor dashboard is only accessible when a valid doctor session exists; accessing the doctor route without a session shows the login form.

**User-visible outcome:** After registering, doctors see their Registration ID and Code on a confirmation screen, can copy/save them, and are then taken to the login page where they must explicitly log in to access the dashboard.
