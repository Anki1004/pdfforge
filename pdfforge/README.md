# PDFForge — Full-Stack PDF Toolkit

> **ilovepdf alternative** — 13 tools, Next.js 14 frontend + FastAPI + Ghostscript + qpdf backend.  
> Frontend → Vercel | Backend → Railway (free tier)

---

## Architecture

```
pdfforge/
├── frontend/          ← Next.js 14 (App Router) → Deploy to Vercel
│   ├── app/
│   │   ├── page.tsx             Homepage with tools grid
│   │   ├── tools/merge/         All 13 tool pages
│   │   ├── sitemap.ts           Auto-generated SEO sitemap
│   │   └── robots.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── DropZone.tsx         Drag & drop + file list + size warning
│   │   ├── ToolCard.tsx         Homepage tool cards
│   │   ├── ToolLayout.tsx       Shared tool page wrapper
│   │   └── FormElements.tsx     Inputs, sliders, checkboxes, status msgs
│   └── lib/
│       ├── tools-config.ts      Single source of truth for all 13 tools
│       ├── pdf-client.ts        Browser-side pdf-lib processing
│       ├── api.ts               FastAPI client (Axios)
│       └── tool-metadata.ts     SEO metadata generator
│
└── backend/           ← FastAPI + Ghostscript + qpdf → Deploy to Railway
    ├── main.py                  App entry, CORS, router registration
    ├── routers/
    │   ├── compress.py          Ghostscript compression (4 quality levels)
    │   ├── protect.py           qpdf AES-256 encryption
    │   ├── unlock.py            qpdf decryption
    │   └── rasterize.py         Ghostscript page rasterization
    ├── utils/pdf_utils.py       Shared helpers (file save, run_cmd, cleanup)
    ├── requirements.txt
    ├── Dockerfile
    └── railway.toml
```

## Tool Processing Architecture

| Tool            | Where processed | Library            |
|-----------------|-----------------|-------------------|
| Merge           | Browser         | pdf-lib            |
| Split           | Browser         | pdf-lib + JSZip    |
| Watermark       | Browser         | pdf-lib            |
| Rotate          | Browser         | pdf-lib            |
| Page Numbers    | Browser         | pdf-lib            |
| Sign            | Browser         | pdf-lib            |
| Annotate        | Browser         | pdf-lib            |
| Reorder         | Browser         | pdf-lib            |
| Decorate        | Browser         | pdf-lib            |
| Remove WM (text)| Browser         | String manipulation|
| Remove WM (cover)| Browser        | pdf-lib            |
| **Compress**    | **Server**      | **Ghostscript**    |
| **Protect**     | **Server**      | **qpdf AES-256**   |
| **Unlock**      | **Server**      | **qpdf**           |
| **Rasterize**   | **Server**      | **Ghostscript**    |

---

## Local Development

### 1. Backend

```bash
cd backend

# Install Ghostscript and qpdf (Ubuntu/Debian)
sudo apt-get install ghostscript qpdf

# macOS
brew install ghostscript qpdf

# Python setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run
uvicorn main:app --reload --port 8000
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### 2. Frontend

```bash
cd frontend

# Install
npm install

# Environment
cp ../.env.example .env.local
# Edit: NEXT_PUBLIC_API_URL=http://localhost:8000

# Run
npm run dev
# App: http://localhost:3000
```

---

## Production Deployment

### Step 1 — Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Point to your `/backend` directory
3. Railway auto-detects the Dockerfile and builds it
4. Add environment variable in Railway dashboard:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.pdfforge.app
   ```
5. Copy your Railway URL: `https://xxxxxx.up.railway.app`

### Step 2 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://xxxxxx.up.railway.app
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```
4. Update `frontend/vercel.json` → replace `YOUR_RAILWAY_APP` with your Railway URL
5. Deploy

### Alternative Backend: Render

Render also supports Docker. Create a new Web Service → Docker → point to `/backend`.
Free tier gives you 750 hours/month (enough for a solo project).

---

## SEO Strategy (How to Rank)

Each tool has its own dedicated URL (`/tools/merge`, `/tools/compress`, etc.) with unique:
- `<title>` tag
- `<meta description>`
- OpenGraph / Twitter card
- Keyword list
- Canonical URL
- Auto-generated sitemap at `/sitemap.xml`

### Target Keywords (already configured in `tools-config.ts`)

| Tool     | Primary keyword              | Monthly searches |
|----------|------------------------------|-----------------|
| Compress | "compress pdf online free"   | 450K             |
| Merge    | "merge pdf online free"      | 750K             |
| Split    | "split pdf online"           | 300K             |
| Sign     | "sign pdf online free"       | 200K             |
| Protect  | "password protect pdf"       | 180K             |

### Next SEO steps

1. **Blog content** — Write 1500-word guides like "How to Compress a PDF Without Losing Quality"
2. **Backlinks** — Submit to ProductHunt, AlternativeTo, Hacker News Show HN
3. **Internal linking** — Each tool page already links to 4 related tools
4. **Core Web Vitals** — All browser tools need zero server time → fast FCP/LCP

---

## Adding a New Tool

1. Add entry to `frontend/lib/tools-config.ts`
2. Create `frontend/app/tools/your-tool/page.tsx`
3. Add browser logic to `frontend/lib/pdf-client.ts` (if browser-side)
4. OR add a new router in `backend/routers/your_tool.py` (if server-side)
5. Register router in `backend/main.py`

---

## Performance Notes

- **Rasterize** is memory-heavy. The 50 MB warning is intentional. For very large files (100+ pages at 216 DPI), the server needs ~2 GB RAM.
- **Compress** with Ghostscript can take 30–60 seconds on a free-tier server for large files. The progress bar uses upload/download progress, not processing progress.
- Browser tools are instant for files under 20 MB. Larger files may be slow on mobile.

---

## Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | Next.js 14, TypeScript, Tailwind |
| PDF (browser)| pdf-lib 1.17, JSZip, pdfjs-dist |
| PDF (server)| Ghostscript, qpdf               |
| Backend     | FastAPI, Uvicorn, Python 3.12   |
| Frontend hosting | Vercel (free)              |
| Backend hosting | Railway / Render (free)    |
| Fonts       | Syne (display), DM Sans (body)  |

---

## License

MIT — use commercially, modify freely.
