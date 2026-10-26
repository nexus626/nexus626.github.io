# MuSyChEN–626 Phase 2 production release

Public site: https://nexus626.github.io/phase2.html
Target tab: Variant Recognition Registry

## Release status
Prepared and locally tested. NOT activated until the Apps Script deployment exists and the six end-to-end tests are read back from Sheets.

## Deploy registry
1. Create a new standalone Apps Script project and paste Phase2Registry.gs. This avoids changing the Phase 1 deployment.
2. In Project Settings > Script properties set REGISTRY_ID to the existing private spreadsheet ID. Do not commit this value to GitHub. Deploy as Web app: execute as the spreadsheet owner, access Anyone. Approve the requested spreadsheet permission as the owner.
3. Set the returned /exec URL in phase2-config.js (and the source HTML bundle), then rebuild the one-file page.
4. Check /exec?action=health returns NEXUS_PHASE2.
5. Submit the six payloads through the actual public page (not through the Sheets connector). Verify each matching request ID in column M and all values in columns A:L.
6. Retry one request with the same request ID and verify there is no additional row. Test rejection of missing names, invalid party size, incomplete Variant details, and switching from Variant to Prime/decline.
7. After readback succeeds, publish the bundled page to phase2.html and index.html. Preserve the Phase 1 files and existing registration data.

The frontend does not show success for an opaque no-cors POST. It waits for a status callback from the registry confirming that the matching request ID is stored. Retries reuse the request ID. Only status/receipt data, not participant details, is exposed by the public status endpoint.

## Six real-record cases
- TEST_PHASE2 / DECLINE_SINGLE: not attending, party 0, no identity, no passport.
- TEST_PHASE2 / DECLINE_AFTER_VARIANT: decline after filling Variant fields; stored identity blank.
- TEST_PHASE2 / PRIME_SINGLE: Prime, party 1, Human.
- TEST_PHASE2 / PRIME_PARTY: Prime, party 2, Human.
- TEST_PHASE2 / VARIANT_SINGLE: declared Variant, party 1, all three fields.
- TEST_PHASE2 / VARIANT_PARTY: declared Variant, party 3, all three fields.

Local validation: node test-registry.cjs. These local tests use a mock spreadsheet and do not constitute a live Sheets test.
