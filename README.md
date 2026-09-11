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


## v1.0 sound + recognition update
- removed the continuous cosmic soundtrack
- removed the previous synthetic tones
- audio now consists only of UI clicks and sparse radio/deep-space interference
- Phase 2 no longer asks guests to remember or type their Nexus ID
- the Nexus ID can be resolved automatically from:
  1. a personalised URL such as `?nexus=VAR-626-AB12`
  2. the Phase 1 record stored in the same browser
- Species remains free text; no predefined taxonomy is imposed

Recommended December link format:
`https://nexus626.github.io/?nexus=VAR-626-AB12#recognitionCenter`


## v1.1 guest identity / party size update

Phase 1 now collects:
- First name
- Last name
- Expected party size, including the respondent
- Date availability
- Food requirements
- Nexus ID

Phase 2 collects again:
- First name
- Last name
- Final crossing status
- Final party size if attending
- Variant declaration
- Species / nature

The repeated name makes the final attendance list human-readable even if the
guest opens Phase 2 without the same browser/session.


## v1.2 hotfix
- restored the missing `appendInstantLine()` compilation helper
- fixed the initialization freeze introduced in v1.1
- audio initialization can no longer block the invitation
- if any compilation animation fails, the full transmission is revealed automatically
