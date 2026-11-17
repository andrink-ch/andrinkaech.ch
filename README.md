# andrinkaech.ch

Persönliche CV-Website von Andrin Käch – live unter https://andrinkaech.ch (GitHub Pages).

## Aufbau

```
index.html          Inhalt und Struktur der Seite
css/styles.css      Farben, Layout, Animationen (hell und dunkel)
js/main.js          Interaktionen: Details, Scroll-Effekte, Kontakt, Navigation
js/hero.js          3D-Szene im Hero (three.js, per CDN geladen)
assets/             Bilder
serve.mjs           Kleiner lokaler Server für die Vorschau
```

## Lokal ansehen

```bash
node serve.mjs
```

Dann http://localhost:5181 öffnen.

## Veröffentlichen

Jeder Push auf `main` ist nach etwa einer Minute auf andrinkaech.ch live.
