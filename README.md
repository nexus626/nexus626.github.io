# MuSyChEN–626 — v1.4 STABLE REBASE

This build is rebased directly on the three user-provided files identified as the
last working version.

Key fix:
- adds the missing `appendInstantLine()` helper that the supplied JavaScript calls
  during compilation.

Current Phase 1:
- First name
- Last name
- Expected party size
- Availability for every date 10–19 Dec 2026
- Dietary requirements
- Allergies / intolerances
- Automatic Nexus ID

Current Phase 2:
- remains OFFLINE by default
- First name + last name
- Nexus ID resolves automatically from personalised URL or Phase 1 browser record
- I WILL CONVERGE / I WILL NOT CONVERGE
- final party size
- free-text Variant declaration
- free-text species / nature

Audio:
- no continuous soundtrack
- short interface clicks
- sparse radio/deep-space interference only

To activate Phase 2 later:
1. set `PHASE2_GOOGLE_SHEETS_ENDPOINT`
2. change `VARIANT_RECOGNITION_CENTER` from `OFFLINE` to `OPERATIONAL`
3. upload only the updated `script.js`
