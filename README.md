# Prayer Book

A simple offline-first PWA for reading prayers organized by folders and subfolders. Built with vanilla JavaScript, Vite, Tailwind CSS, Dexie.js (IndexedDB), and Swiper.js.

## Features

- **Folder hierarchy** — Prayers organized into folders and subfolders
- **Swipe reading** — Full-screen swipeable prayer reader with accessibility support
- **Offline-first PWA** — Service worker caches all assets for offline use
- **JSON import/export** — Backup and restore prayers via JSON files
- **Admin panel** — Add individual prayers or bulk import from JSON

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite 5 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| Dexie 3 | IndexedDB wrapper for client-side storage |
| Swiper 11 | Touch-friendly swipe navigation in reader view |
| vite-plugin-pwa 0.20 | Service worker generation and caching strategy (CacheFirst for assets, NetworkFirst for data)

## Getting Started

```bash
npm install
npm run dev      # Start dev server on localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

## JSON Import Format

Use the admin panel to import prayers as a JSON array:

```json
[
  {
    "id": 1,
    "title": "Morning Grace",
    "folder": "Daily Prayers",
    "subfolder": "Morning",
    "content": "...prayer text here..." 
  }
]
```

## Credits

This project was developed using [Kilo](https://kilo.ai), a local coding agent, powered by the Qwen3.6-27B model. All code generation and project scaffolding were handled locally on the developer's machine.
