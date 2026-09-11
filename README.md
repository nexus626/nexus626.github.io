# MuSyChEN–626 — v0.8

This is the "dormant Phase 2" version.

## Phase 1 — active
Collects:
- Name
- Every compatible date from 10–19 December 2026
- Dietary requirements
- Allergies / intolerances / food notes
- Automatically generated Nexus ID

## Phase 2 — already coded, currently OFFLINE
Visitors can already see the Variant Recognition Center, but the system reports:

- CRITICAL SPACETIME INSTABILITY DETECTED
- NEXUS ID VERIFICATION — PENDING
- FINAL CROSSING STATUS — PENDING
- VARIANT DECLARATION — UNRESOLVED
- SPECIES CLASSIFICATION — UNRESOLVED
- INTERDIMENSIONAL PASSPORT — CANNOT BE ISSUED

The functional Phase 2 form is already inside the website but hidden.

## To activate Phase 2 later
In `script.js`, change:

`const VARIANT_RECOGNITION_CENTER = "OFFLINE";`

to:

`const VARIANT_RECOGNITION_CENTER = "OPERATIONAL";`

and add the Phase 2 Google Apps Script `/exec` URL to:

`const PHASE2_GOOGLE_SHEETS_ENDPOINT = "";`

Then upload only the updated `script.js` to GitHub.

## Deploy v0.8 now
Replace in the root of `nexus626.github.io`:
- index.html
- styles.css
- script.js

Do not upload the Google Sheets setup folders unless you want them publicly visible.


## v0.9 audio update
- stronger and more frequent glitch sounds
- new cosmic ambient background generated directly in the browser
- more cinematic "space / multiverse" atmosphere
- still no external audio files needed
- audio starts only after user interaction because of browser autoplay rules
