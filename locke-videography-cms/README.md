# Locke Videography

Static site with a Decap CMS admin dashboard for managing Travel Film content.

## Local preview
Because content loads via `fetch()`, opening files directly (file://) won't
load the dynamic sections. Serve locally instead:

    python3 -m http.server 8000

Then visit http://localhost:8000

## Editing content
Once deployed and connected to Netlify Identity, go to /admin to log in and
edit Travel Film works (text + images) without touching code.
