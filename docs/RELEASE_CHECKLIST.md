# Replace the current GitHub Pages version safely

The already submitted address must remain:

https://masasawilson052-cyber.github.io/TRA-SmartTax-Web/

1. Retain the existing repository and its GitHub Pages configuration. Record the current commit as the rollback point.
2. Review the new prototype at its separate preview link. Use sample/redacted data only.
3. Commit the **contents** of `dist/` to the root of the same publishing branch. Do not rename the repository or insert an extra folder in the published path. The root `index.html` is the entrypoint.
4. Wait for the existing Pages workflow to finish. The root `index.html`, scripts, local vendor files, icon, sample receipt and service worker must all publish together.
5. Open the original submitted address on Android Chrome and a desktop browser. Confirm navigation, English/Kiswahili switching and light/dark themes.
6. Load the sample receipt through the actual reader; change a field; confirm and save; refresh; verify the saved record and source download.
7. Upload the same receipt again and confirm the duplicate warning. Try an unreadable image and an unsupported/oversized file; no invented result should appear.
8. Download a monthly PDF and CSV. Check that the visible totals match the files and unconfirmed records remain excluded. Download a non-fiscal business receipt and a calendar reminder.
9. Test complete/incomplete records at TZS 4M, 7M and 11M. Above 11M, the rate-conflict explanation must appear. Unsupported regimes and new-business relief must ask for verification.
10. Load the capture tools once online, then test an offline revisit on the same browser. A first-ever offline visit or an uncached document tool is not supported.
11. Review the published proposal alignment and capability labels. The prototype must not claim real TIN login, TRA approval, fiscal receipt issuance, filing, payment, generative AI or a tamper-proof audit trail.

If a serious defect appears, restore the retained prior Git commit. Bump the service-worker cache version whenever publishing changed source. A successful private Sites preview deployment does not automatically update GitHub Pages.
