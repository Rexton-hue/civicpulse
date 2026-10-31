# Posting CivicPulse on GitHub (and deploying it)

## Step 1: One-time setup

1. Install Git: https://git-scm.com/downloads
2. Create a free GitHub account at https://github.com if you do not have one.
3. Tell Git who you are (use the same email as your GitHub account):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Step 2: Create the empty repository on GitHub

1. Sign in, click **+** (top right) and choose **New repository**.
2. Repository name: `civicpulse` (or `HACK-P423-civicpulse`).
3. Choose **Public** (hackathon judges need to open it).
4. **Do not** tick "Add a README", ".gitignore" or "license". The project already has them, and an empty repo avoids merge conflicts.
5. Click **Create repository**. Keep the page open; you will need the repository URL, for example `https://github.com/<your-username>/civicpulse.git`.

## Step 3: Push the project from your computer

Open a terminal **inside the project folder** (the one containing `package.json`).

```bash
git init
git add .
git status
```

Check the `git status` list. You should **not** see `node_modules/`, any `.db` file or `.env`. They are excluded by `.gitignore`. If you see them, stop and fix `.gitignore` before continuing.

```bash
git commit -m "Initial commit: CivicPulse grievance tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/civicpulse.git
git push -u origin main
```

**Sign-in when pushing:** GitHub no longer accepts your account password on the command line. Use either:

- **Personal access token:** GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token, tick `repo`, copy it, and paste it when Git asks for a password.
- **GitHub CLI:** install from https://cli.github.com, run `gh auth login`, then `git push -u origin main`.

Refresh the repository page. You should see all files and the README with screenshots.

## Step 4: Make the repository look professional

- **About box** (gear icon, top right of the repo): add a description, such as "Public grievance tracker with role-based access, built with Node.js, Express, SQLite and JWT", and topics like `nodejs`, `express`, `sqlite`, `jwt`, `hackathon`.
- Replace `<your-username>` in the README clone command and the `<team name>` / `<names>` placeholders in the Team section, then commit:

```bash
git add README.md
git commit -m "Update README with team details"
git push
```

- Commit in small steps from now on (one fix or feature per commit) so the history shows your work.
- Upload your demo video to YouTube (Unlisted) or Google Drive and paste the link near the top of the README.

## Step 5: Deploy the live demo on Render

1. Sign in at https://render.com using your GitHub account.
2. Click **New > Blueprint**, pick the `civicpulse` repository. Render reads `render.yaml` and fills in the build and start commands.
3. Confirm. Render generates a `JWT_SECRET` for you.
4. Wait for the first deploy (a few minutes). Your live URL looks like `https://civicpulse-xxxx.onrender.com`.
5. Open it, log in with the demo accounts, and check `/api/health` returns `{"status":"ok"}`.

Notes:

- The free plan sleeps after inactivity, so the first request can take about 30 to 60 seconds. Open the URL a minute before a demo.
- The free plan has no persistent disk, so data resets on restart. Demo data is recreated automatically.

## Step 6: Update the slides

On the last slide of `CivicPulse_Hackathon.pptx`, replace:

- `GitHub: <link>` with your repository URL
- `Live: <link>` with your Render URL
- `Team <name>` on the title slide with your team name

## Step 7: Check before you submit

- [ ] Repository is **public** and opens in a private/incognito browser window
- [ ] A fresh clone works: `git clone <url> && cd civicpulse && npm install && npm test && npm start`
- [ ] README shows screenshots, demo logins and the live link
- [ ] No secrets committed (`.env` and `*.db` are not in the repo)
- [ ] Live URL loads and the demo logins work
- [ ] Demo video link works without signing in

## Common problems

| Problem | Fix |
|---|---|
| `remote origin already exists` | `git remote set-url origin https://github.com/<you>/civicpulse.git` |
| `failed to push some refs` (repo not empty) | You ticked "Add a README" on GitHub. Run `git pull origin main --allow-unrelated-histories`, resolve any conflict, then push |
| `Authentication failed` | Use a personal access token or `gh auth login`, not your password |
| `node_modules` appeared in the repo | `git rm -r --cached node_modules` then commit and push |
| Render build fails | Open the deploy log; confirm the Node version is 22.13 or newer (the blueprint sets NODE_VERSION=22) and that `package.json` is in the repo root |
