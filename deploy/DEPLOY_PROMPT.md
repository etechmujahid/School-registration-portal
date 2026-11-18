# One-prompt deployment

Copy everything inside the block below into a new Claude Code session opened in
`C:\Temp\School-registration-portal`.

```text
Deploy the School Registration Portal (React + Vite SPA) from this repo to the live site
https://school.techhorizon.tech on this Windows Server 2022 machine (IP 154.38.169.165, IIS).
Do the whole thing end to end and only stop if something fails.

Setup already in place (don't redo it unless it's missing):
- IIS site "SchoolPortal" (own app pool) serves C:\inetpub\school-portal. Bindings: http *:80 and
  https *:443 for school.techhorizon.tech. URL Rewrite is installed.
- public/web.config handles SPA fallback and redirects HTTP to HTTPS (it skips localhost and
  /.well-known/acme-challenge).
- Let's Encrypt certificate from win-acme (C:\tools\win-acme\wacs.exe). It is stored in the
  WebHosting store and renews through the "win-acme renew" scheduled task.
- DNS: school.techhorizon.tech has an A record pointing to 154.38.169.165.
- Don't touch the other IIS sites: "Default Web Site", "test580.limousine.com" (holds the bare
  IP on port 80) and "TimeTrackerAPI".

Steps:
1. Pre-flight: run git status and report uncommitted changes, then npm ci and npm run build.
   The build must pass. Lint warnings in files that already had them are fine.
2. Deploy: the Claude session is NOT elevated. Run deploy\deploy-iis.ps1 through
   Start-Process powershell -Verb RunAs -Wait and log output to deploy\deploy.log. I will click
   Yes on the UAC prompt. Never ask me for a password. The script copies dist\ and leaves the
   bindings alone.
3. Verify against the live domain (use curl or PowerShell, not the in-app browser, which blocks
   this domain's JS/CSS with ERR_BLOCKED_BY_CLIENT):
   - https://school.techhorizon.tech/, /login and /dashboard/applications return 200
   - http:// returns 301 to https:// and keeps the path and query string
   - the /assets/index-*.js referenced by the live page is byte-identical to dist\
   - the certificate is valid (Let's Encrypt, CN=school.techhorizon.tech) and not expiring
     within 30 days
   - https://timetracker.techhorizon.tech still returns 200
   For a visual check, run headless Chrome via Start-Process with
   --headless --no-sandbox --screenshot=<scratchpad>\live.png.
4. If something is missing, fix it:
   - SchoolPortal site gone: re-run the deploy script (it creates the site).
   - HTTPS binding or certificate gone: run elevated
     C:\tools\win-acme\wacs.exe --source iis --siteid <SchoolPortal id> --host school.techhorizon.tech --installation iis --closeonfinish
   - This server's DNS lookup fails right after a DNS change: its resolver 209.126.15.51
     caches negative answers for about 10 minutes. Check with -Server 8.8.8.8 and pin the IP
     with curl --resolve.
5. Git (only if there are code changes to keep): commit on a feature branch, then fast-forward
   main. This machine has no git identity, so pass -c user.name/-c user.email using the author
   of the existing commits. Ask before pushing. A push may fail with 403 because the saved
   GitHub login is "etech-portals", which has no write access to
   etechmujahid/School-registration-portal. If so, just report it.
6. Finish with a short report: live URL, what was deployed (commit or bundle hash), the
   verification results, and anything not done.
```

## Notes

- **Reaching admin rights:** when Claude ran as administrator, the session still wasn't
  elevated. Elevating each admin step with a UAC prompt is what worked.
- **Code changes:** to ship a change along with the deploy, describe it before the block, for
  example "Make X work, then deploy:". The same steps apply.
