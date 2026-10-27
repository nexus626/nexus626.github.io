# MuSyChEN–626 Phase 2 — LIVE

Main site: https://nexus626.github.io/
Direct Phase 2: https://nexus626.github.io/phase2.html

Released 27 October 2026. Registry service version 2 is active. The availability page is preserved as phase1-archive.html.

## Verified behavior
Six real cases have been submitted and read back from the Variant Recognition Registry:
- DECLINE_SINGLE: no attendance, party 0, blank identity/passport.
- DECLINE_AFTER_VARIANT: decline clears the prior Variant fields.
- PRIME_SINGLE: Prime/Human, party 1, PENDING passport.
- PRIME_PARTY: Prime/Human, party 2, PENDING passport.
- VARIANT_SINGLE: all three identity fields, party 1, PENDING passport.
- VARIANT_PARTY: all three identity fields, party 3, PENDING passport.

The six retained rows are labelled TEST_PHASE2. Exclude these from guest counts. A separate browser smoke test confirmed the receipt after a real save; its temporary row was removed. Repeating a request ID did not create another row. The live service rejected missing names, zero or fractional party sizes, incomplete Variant details, and unknown crossing statuses.

Passport Status uses the existing PENDING / PRINTED dropdown; non-attendance leaves it blank. Request ID is a hidden technical field, not a passport number. The frontend waits for confirmation that the exact request ID exists before showing success. Guests sharing a device keep distinct personal Nexus identifiers.

## Files
- Phase2Registry.gs: deployed backend; REGISTRY_ID is configured privately in Script properties.
- phase2-config.js: public web-app endpoint configuration.
- registry-client.js: POST and save-receipt handling.
- ui.js, effects.js, nova.js, style.css: source modules.
- phase2-ready.html: self-contained final page, identical to the main published page.
- test-registry.cjs: local validation and duplicate checks; run with node.

No prototype or simulated submissions remain on the live page. Arrival time remains pending by design.
