# Specification

## Summary
**Goal:** Fix the Admin Portal so it correctly authenticates, displays live stats, and auto-refreshes every 5 seconds.

**Planned changes:**
- Add backend query functions to return accurate counts for total doctors, total cases, and total active/critical emergencies (no auth required)
- Add three React Query hooks in `useQueries.ts` for fetching each stat count with a 5-second `refetchInterval`, returning 0 as default on error
- Rewrite `AdminDashboard` to show three stat cards (Total Doctors, Total Cases, Total Emergencies) populated from those hooks, with loading and error states
- Fix `AdminPortal.tsx` passcode gate to correctly render `AdminDashboard` after successful login, and return to the login screen on logout

**User-visible outcome:** The admin can enter the passcode, see a working dashboard with live-updating counts for doctors, cases, and emergencies refreshing every 5 seconds, and log out cleanly — with no blank screens or broken states.
