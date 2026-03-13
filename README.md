# LinkStash

> Save, tag, and find your links — effortlessly.

![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

LinkStash is a self-hosted bookmark manager that automatically fetches page metadata (title, description, OGP thumbnail) when you paste a URL, suggests tags, and lets you organize everything with filters, search, and priority ratings.

No cloud accounts. No tracking. Your data stays in a local JSON file.

---

## Features

| Feature | Description |
|---------|-------------|
| **Auto-fetch metadata** | Paste a URL and get the title, description, and thumbnail automatically |
| **Smart tag suggestions** | Tags are suggested based on domain and keywords in the title |
| **5-star priority rating** | Click stars on any card to set importance (1-5) — sort by priority |
| **Status tracking** | Mark links as Unread / Read / Important |
| **Tag & keyword search** | Filter by tags (AND logic) and search across title, URL, and summary |
| **Card & list views** | Toggle between visual card grid and compact list view |
| **Bookmarklet** | One-click save from any page via a browser bookmarklet |
| **Markdown export** | Export your links (with optional tag filter) as a Markdown file |
| **Memos** | Add personal notes to any saved link |
| **Dark / Light theme** | Toggle between dark and light themes — preference saved automatically |
| **JA / EN language toggle** | Full bilingual UI — switch anytime with one click |

---

## Screenshots

<!-- Add screenshots here -->

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/MiraQue/LinkStash.git
cd LinkStash
pip install -r requirements.txt
```

### 2. Run

```bash
python app.py
```

The app opens automatically at `http://localhost:5000`.

### 3. Save your first link

Paste a URL into the top bar and press Enter. Review the auto-fetched info, adjust tags, set priority, and click **Save**.

---

## Bookmarklet Setup

Visit `http://localhost:5000/bookmarklet` after starting the app. Drag the button to your bookmark bar — then one-click save from any page.

---

## Project Structure

```
LinkStash/
├── app.py              # Flask backend & API
├── fetcher.py          # URL metadata fetcher (OGP / meta tags)
├── tag_engine.py       # Auto-tag suggestion engine
├── index.html          # Frontend UI
├── style.css           # Styles (dark glassmorphism theme)
├── app.js              # Frontend logic (vanilla JS)
├── bookmarklet.html    # Bookmarklet setup page
├── requirements.txt    # Python dependencies
└── data/
    └── links.json      # Your saved links (auto-created, git-ignored)
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/fetch` | Fetch metadata for a URL (preview before saving) |
| `GET` | `/api/links` | Get all saved links |
| `POST` | `/api/links` | Save a new link |
| `PUT` | `/api/links/<id>` | Update a link (tags, memo, status, priority, title, summary) |
| `DELETE` | `/api/links/<id>` | Delete a link |
| `GET` | `/api/tags` | Get all tags (from links + custom) |
| `POST` | `/api/tags` | Add a custom tag |
| `GET` | `/api/export/markdown` | Export links as Markdown (optional `?tags=` filter) |

---

## Data Format

Links are stored in `data/links.json`:

```json
{
  "id": "uuid",
  "url": "https://example.com",
  "title": "Page Title",
  "summary": "Meta description...",
  "thumbnail": "https://example.com/og-image.jpg",
  "tags": ["dev", "tutorial"],
  "status": "unread",
  "priority": 3,
  "memo": "Check the section on caching",
  "created_at": "2026-03-13T12:00:00+09:00"
}
```

`status`: `"unread"` | `"read"` | `"important"`
`priority`: `0` (unset) to `5` (highest)

---

## Tag Engine

Tags are suggested automatically from two sources:

- **Domain-based**: 40+ domain rules (e.g., `github.com` -> `dev, tools, OSS`)
- **Keyword-based**: 50+ keyword patterns matched against title and description

You can always add, remove, or create custom tags manually.

---

## Tech Stack

- **Backend**: Python 3.9+ / Flask
- **Frontend**: Vanilla HTML + CSS + JavaScript (no build step)
- **Storage**: Local JSON file (`data/links.json`)
- **Metadata**: `requests` + `BeautifulSoup4` (OGP / meta tag parsing)

---

## Configuration

| Setting | Location | Default |
|---------|----------|---------|
| Port | `app.py` line 21 | `5000` |
| Data file | `app.py` line 20 | `data/links.json` |
| Request timeout | `fetcher.py` line 17 | `10` seconds |

---

## License

MIT License. See [LICENSE](LICENSE) for details.
