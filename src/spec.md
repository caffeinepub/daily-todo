# Specification

## Summary
**Goal:** Add a dark mode toggle to reduce eye strain while using the application.

**Planned changes:**
- Add a toggle button in the application header to switch between light and dark modes
- Apply dark mode styling using the existing OKLCH color variables by adding a 'dark' class to the html/body element
- Store the user's dark mode preference in localStorage to persist across sessions
- Ensure the selected mode is applied immediately on page load without visual flashing

**User-visible outcome:** Users can toggle between light and dark color schemes using a button in the header, and their preference will be remembered across browser sessions.
