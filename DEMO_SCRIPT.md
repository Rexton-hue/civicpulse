# CivicPulse: Demo Video Script (about 4.5 minutes)

**Format:** screen recording with voice-over (OBS Studio, Loom, or the screen recorder built into your OS). Record at 1080p, browser zoomed to 110 percent so text is readable.

## Before you record (2 minutes)

- [ ] `npm install` done and the app running fresh: delete `civicpulse.db`, then `npm start`. A fresh start gives the same demo data every time (`GRV-0001` to `GRV-0006`).
- [ ] Two browser windows ready: one normal, one Incognito (for the citizen and officer at the same time). Open `http://localhost:3000` in both.
- [ ] A terminal open in the project folder with a large font.
- [ ] Close notifications. Hide bookmarks. Keep the cursor slow and deliberate.
- [ ] Have the logins handy: `citizen@civicpulse.local / Citizen@123`, `officer@civicpulse.local / Officer@123`, `admin@civicpulse.local / Admin@123`.

## Scene 1: Hook and problem (0:00 to 0:25)

**Screen:** title slide, then the CivicPulse home page.

**Say:**
"Every city receives thousands of complaints, and most citizens never learn what happened to theirs. There is no tracking number, no status, and no way to see who is responsible. This is CivicPulse, a public grievance tracker built with Node.js, Express, SQLite and JWT for the Backend Web Development Hackathon."

## Scene 2: Citizen files a grievance (0:25 to 1:20)

**Screen:** normal window. Click **Log in / Register**, then the **Register** tab.

**Do:** register a new citizen: name "Demo Citizen", email `demo@example.com`, password `Demo12345`.

**Say:**
"A citizen registers. Passwords are hashed with bcrypt, and public registration always creates a citizen account, so nobody can sign themselves up as an admin."

**Do:** in **File a new grievance**, enter title "Broken swing in park", category Public Safety, location "Central Park", and a short description. Click **Submit grievance**.

**Say:**
"Now they file a grievance. The server validates every field, and as soon as it is saved we get a tracking ID."

**Do:** point to the toast showing the new ID (for example `GRV-0007`), then click the **Review/View** button to show the first history entry "Grievance registered".

## Scene 3: Public tracking, no login (1:20 to 1:50)

**Screen:** Incognito window, home page.

**Do:** type the new ID into **Track your grievance**, press Enter.

**Say:**
"Anyone with the ID can check progress without logging in. They see the status and the timeline, but none of the citizen's personal details, because the public endpoint never returns them."

## Scene 4: Officer reviews and updates (1:50 to 2:50)

**Screen:** normal window. Log out, log in as `officer@civicpulse.local`.

**Say:**
"Officers get a different view. This dashboard shows total grievances, how many are pending, the resolution rate, and breakdowns by status and category."

**Do:** point to the **Recurring unresolved issues** card (Roads at MG Road, 2 open reports).

**Say:**
"The recurring issues panel spots the same problem reported again and again in the same place, so authorities can fix root causes instead of single complaints."

**Do:** use the filters: choose **Public Safety** and click **Filter**, then clear it. Search for `pothole`.

**Say:**
"Filters, search and pagination are all handled by query parameters on the API."

**Do:** open the new grievance with **Review**, choose **Under Review**, remark "Inspector assigned", **Save update**. Then update again to **In Progress**.

## Scene 5: Citizen sees progress, rules are enforced (2:50 to 3:30)

**Screen:** Incognito window, refresh the tracking page.

**Say:**
"The citizen refreshes and sees the officer's remark and the new status immediately. The pipeline only moves forward, resolving requires a remark, and a citizen cannot change status."

**Screen:** terminal. Run this to show a rule being enforced (replace the ID if needed):

```bash
TOKEN=$(curl -s -X POST localhost:3000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"citizen@civicpulse.local","password":"Citizen@123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
curl -s -X PUT localhost:3000/api/grievances/1 -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"status":"Resolved","remark":"done"}'
```

**Say:**
"A citizen trying to mark their own grievance as resolved gets a 403. Roles are enforced on the server, not just hidden in the interface."

## Scene 6: Admin and tests (3:30 to 4:10)

**Screen:** log in as `admin@civicpulse.local`, open a grievance, show the red **Delete** button (officers do not have it).

**Say:**
"Only an admin can delete, and deleting also removes the history through a cascade."

**Screen:** terminal. Run `npm test`.

**Say:**
"Behind this are 29 automated API tests covering authentication, validation, role checks, filters, pagination, the status pipeline and deletion. All 29 pass."

## Scene 7: Close (4:10 to 4:30)

**Screen:** architecture slide or the README.

**Say:**
"CivicPulse is built on an Express backend with JWT authentication, role-based middleware, a normalised SQLite database with joins, indexes and foreign keys, and a lightweight frontend. Next steps are SMS and email notifications, photo evidence, department routing and SLA escalation. The code is on GitHub and the live demo is on Render. Thank you."

## Recording tips

- Record voice-over in one take per scene; cut between scenes. Aim for a steady, calm pace.
- If the free Render instance is asleep, open the live URL a minute before recording.
- Export as MP4 (H.264), under 5 minutes. Upload to YouTube as Unlisted or to Google Drive and share the link.
- Add subtitles if your video tool offers auto-captions.
