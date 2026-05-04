# Shooting Book App — Projektstatus

## Was ist das?

Eine Web-App für Schießsport-Trainingsprotokolle. Nutzer können Trainings und Bewerbe erfassen, Blöcke & Serien mit Scores eintragen, Statistiken einsehen und Daten als Excel exportieren.

---

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | Vanilla JS + Vite |
| Styling | CSS (src/style.css) |
| Datenbank & Auth | Supabase |
| Excel-Export | exceljs |
| Hosting | Vercel (via GitHub) |
| Paketmanager | npm |

---

## Features

- Splash-Screen mit Start-Button
- Login & Registrierung via Supabase Auth
- **Tab: Neuer Eintrag** — Training oder Bewerb, mit Datum, Ort (inkl. Standort-Button), Notiz
- **Tab: Statistik** — Auswertungen der Einträge
- **Tab: Meine Einträge** — Liste aller Einträge, filterbar, mit Excel-Export
- Blöcke & Serien mit Waffe, Disziplin, Schuss pro Serie, Scores
- Excel-Export mit 3 Sheets: Sessions, Blöcke, Serien (inkl. Autofilter & Spaltenbreiten)
- PWA-fähig (Manifest, Icons, Theme-Color)

---

## Projektstruktur

```
shooting-book-app/
├── src/
│   ├── main.js        # Gesamte App-Logik
│   └── style.css      # Styling
├── public/
│   ├── icon.png
│   ├── cover.png
│   └── site.webmanifest
├── index.html
├── package.json
├── package-lock.json
├── .env               # Supabase Keys (nicht in Git!)
├── .env.example       # Vorlage für Keys
└── .gitignore
```

---

## Zugänge & Konfiguration

### Lokal
- Arbeitsverzeichnis: `/Users/mcbooktehn/Claude/shooting-book-app`
- Dev-Server starten: `npm run dev` → http://localhost:5173
- Build: `npm run build`

### Supabase
- URL & Anon Key in `.env` (lokal) und in Vercel Environment Variables eingetragen
- Variablen: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### GitHub
- Repo: https://github.com/thmshn75/shooting-book-app
- Branch: `main`
- Auth via GitHub CLI (`gh`) — eingeloggt als `thmshn75`

### Vercel
- Hosting: automatisches Deploy bei jedem Push auf `main`
- Environment Variables: beide Supabase-Keys eingetragen
- URL: im Vercel-Dashboard unter dem Projekt sichtbar

---

## Workflow: Änderungen deployen

```bash
# 1. Änderungen lokal testen
npm run dev

# 2. Committen und pushen → Vercel deployt automatisch
git add .
git commit -m "Beschreibung der Änderung"
git push
```

---

## Durchgeführte Arbeiten (April 2026)

### Session 1 — Setup & Sicherheit (14. April 2026)

**Problem:** Node.js war nicht installiert, App lief nicht lokal.
**Lösung:** Node.js via Homebrew installiert (`brew install node`).

**Sicherheitslücken behoben:**
- `xlsx` entfernt → ersetzt durch `exceljs` (aktiv gepflegt, keine bekannten Vulnerabilities)
- `vite` von v5 auf v8.0.8 upgegraded (esbuild-Vulnerability behoben)
- Ergebnis: `npm audit` → **0 vulnerabilities**

**GitHub Auth eingerichtet:**
- GitHub CLI installiert (`brew install gh`)
- Eingeloggt als `thmshn75` via Browser
- Push funktioniert jetzt automatisch

---

## Offene Punkte / Mögliche nächste Schritte

- [ ] Bundle-Größe optimieren (aktuell ~1.2 MB, Vite-Warnung bei >500 KB)
- [ ] Weitere Features nach Bedarf
