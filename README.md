# DTRC project website

Project page for **Directed Temporal Representations for Offline Visual Control**.

- **Website:** https://chenyang-yuan.github.io/dtrc-project/
- **Implementation:** https://github.com/Chenyang-Yuan/DTRC

The website presents the method, visual representations across ten tasks, training evolution, control results, and closed-loop rollouts.

## Local preview

```sh
python -m http.server 8000
```

Open `http://localhost:8000`. The site uses HTML, CSS, and JavaScript without a build step. GitHub Pages publishes the root of the `main` branch; `.nojekyll` preserves static assets unchanged.

## Files

- `index.html`, `styles.css`, and `app.js`: project page and interactive figures.
- `assets/`: manuscript figures, animations, and paper data.
- `paper.html` and `paper.js`: paper reader. The reader joins two parts of the original PDF and verifies its SHA-256 checksum. No image downsampling or changes to the manuscript are applied.
- `vendor/pdfjs/`: [Mozilla PDF.js 6.4.299](https://github.com/mozilla/pdf.js/releases/tag/v6.4.299), with its included Apache-2.0 license.

The model implementation and checkpoints are maintained separately from this website.
