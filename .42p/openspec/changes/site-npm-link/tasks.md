# Tasks

## 1. Adjacent npm navigation

- [ ] 1.1 Append the npm package link beside GitHub in the existing shared nav array and extend the existing configuration regression check; verify the exact lowercase label, external URL and ordering with `node --test tools/site/tests/site.test.mjs` and a real site build, without introducing another page or dependency.
- [ ] 1.2 Extend `tools/site/browser.mjs` to assert the visible npm link, exact destination and adjacency in both desktop and opened mobile menus; run the existing real stable/preview exercise and verify existing internal navigation, menu closure and overflow checks still pass.

## 2. Integrated check

- [ ] 2.1 Check the new navigation on the identified deployed candidate preview, including the opened mobile menu; record actual URL/revision and outcomes, re-examine `coverage.md`, and run the repository gateway, applicable shell tests and strict OpenSpec validation. Confirm the historical archive and unrelated contracts are byte-identical; do not count old evidence as verification of the npm link.
