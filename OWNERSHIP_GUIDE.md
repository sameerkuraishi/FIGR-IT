# FIGR NXT — Local Setup and Permanent GitHub Ownership

This archive contains the complete source for the FIGR NXT interactive prototype.

## What is real in this prototype

- The profile, assessment, weighted career ranking, skill-gap comparison, roadmap generation, counselling flow, learning hub, tutor fallback, quiz scoring, and roadmap adaptation run in the application.
- Browser persistence uses `localStorage`, so the active demo survives refreshes on the same browser.
- Counsellor profiles, booking, video consultation, and AI tutor fallback are explicitly simulated for the hackathon prototype.
- `backend/app/main.py` is a small FastAPI reference backend. The current frontend still runs safely without it.

## Main source files

- `app/page.tsx` — user interface and interactive journey (React/TypeScript; this is the HTML and JavaScript layer).
- `app/globals.css` — the complete theme and responsive CSS.
- `lib/figr-product.ts` — student model, assessments, careers, counsellors, scoring data, and resources.
- `backend/app/main.py` — optional FastAPI endpoints.
- `app/layout.tsx` — page metadata and root HTML layout.
- `package.json` — frontend packages and commands.
- `.env.example` — safe environment-variable template; it contains no secrets.

## Run the frontend on Windows

Install Node.js 22 or newer and Git. Then extract the ZIP, open the folder in VS Code, and open **Git Bash** inside that folder.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (normally `http://localhost:5173`). Stop it with `Ctrl+C`.

Run the verified build and tests:

```bash
npm test
```

## Run the optional FastAPI backend

Open a second terminal in the project folder:

```bash
python -m venv .venv
source .venv/Scripts/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

Open `http://127.0.0.1:8000/docs` to test the API.

## Push to a new personal GitHub repository

1. Sign in at https://github.com.
2. Select **New repository**.
3. Repository name: `figr-nxt`.
4. Choose **Private** while the hackathon is active (you can make it public later).
5. Do not add a README, `.gitignore`, or licence on GitHub because this folder already contains them.
6. Create the repository and copy its HTTPS URL.
7. In Git Bash inside the extracted folder, run:

```bash
git init
git add .
git commit -m "Initial FIGR NXT source"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/figr-nxt.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. When GitHub asks you to authenticate, complete the browser sign-in.

If `origin` already exists, use:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/figr-nxt.git
git push -u origin main
```

Confirm ownership by refreshing the GitHub repository and checking that `app/page.tsx`, `app/globals.css`, `lib/figr-product.ts`, and `backend/app/main.py` are visible.

## Team workflow after the first push

```bash
git pull origin main
git checkout -b feature/short-feature-name
# edit and test
git add .
git commit -m "Describe the change"
git push -u origin feature/short-feature-name
```

Open a pull request on GitHub instead of having everyone push unfinished work directly to `main`.

## Secrets

Never put MongoDB passwords, API keys, or LLM keys in frontend files or GitHub. Copy `.env.example` to `.env.local` for local values. `.env*` is ignored by Git.

## Independent deployment

Once the code is in your GitHub account, import that repository into Vercel or Cloudflare Pages for the frontend. Deploy the FastAPI backend separately (for example, on Render), then place the backend URL in a local/hosted environment variable. Test the public site in an incognito window before sharing it with judges.

