'use strict';

// Keep the supplied PDF byte-for-byte intact while serving small static assets.
const paperParts = ['assets/paper-20261006-01.bin', 'assets/paper-20261006-02.bin'];
const paperBytes = 35205186;
const paperSha256 = 'a46e96422c22d73d8a29a3a056be5bcf52748515248cab2fe715bb23bbde8868';
const status = document.getElementById('status');
const progress = document.getElementById('progress');
const retry = document.getElementById('retry');

async function openPaper() {
  retry.hidden = true;
  progress.hidden = false;
  progress.value = 0;
  status.textContent = 'Opening paper…';
  try {
    const parts = await Promise.all(paperParts.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Paper download failed');
      const bytes = await response.arrayBuffer();
      progress.value += 1;
      return bytes;
    }));
    const pdf = new Blob(parts, { type: 'application/pdf' });
    if (pdf.size !== paperBytes) throw new Error('Incomplete paper');
    if (window.crypto?.subtle) {
      const digest = await crypto.subtle.digest('SHA-256', await pdf.arrayBuffer());
      const checksum = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
      if (checksum !== paperSha256) throw new Error('Paper integrity check failed');
    }
    const url = URL.createObjectURL(pdf);
    const viewer = document.getElementById('viewer');
    const download = document.getElementById('download');
    download.href = url;
    viewer.src = `vendor/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}#zoom=page-width`;
    viewer.hidden = false;
    download.hidden = false;
    document.getElementById('loading').hidden = true;
    window.addEventListener('pagehide', () => URL.revokeObjectURL(url), { once: true });
  } catch {
    status.textContent = 'The paper could not be loaded. Please try again.';
    progress.hidden = true;
    retry.hidden = false;
  }
}

retry.addEventListener('click', openPaper);
openPaper();
