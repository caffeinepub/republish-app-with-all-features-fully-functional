# Specification

## Summary
**Goal:** Add Progressive Web App (PWA) capabilities and an admin-only QR code generator for sharing admin portal access.

**Planned changes:**
- Create manifest.json file with PWA metadata (app name, teal theme colors, standalone display mode, icons)
- Link manifest.json in index.html to enable mobile installation prompts
- Build QRCodeGenerator component that displays and allows downloading a QR code pointing to the admin portal URL with authentication token
- Integrate QRCodeGenerator into AdminDashboard as a new section visible only to authenticated admin users

**User-visible outcome:** Admins can install Vitals AI as a mobile app from their browser and generate/download a QR code to share admin portal access with the embedded authentication token.
