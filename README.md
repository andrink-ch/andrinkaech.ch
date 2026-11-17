# andrinkaech.ch

Persönliche CV-Website von Andrin Käch für https://andrinkaech.ch (GitHub Pages).

## Aufbau

```
index.html          Inhalt und Struktur der Seite
css/styles.css      Farben, Layout, Animationen (hell und dunkel)
js/main.js          Scroll-Effekte, aktive Navigation, E-Mail kopieren
assets/             Bilder
serve.mjs           Kleiner lokaler Server für die Vorschau
```

## Lokal ansehen

```bash
node serve.mjs
```

Dann http://localhost:5181 öffnen.

## Veröffentlichen

Wenn GitHub Pages eingeschaltet ist, ist jeder Push auf `main` nach etwa einer Minute auf andrinkaech.ch live.
Bei Änderungen an CSS oder JS die Versionsnummer `?v=` in `index.html` erhöhen.
