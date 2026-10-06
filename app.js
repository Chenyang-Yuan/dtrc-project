const dialog = document.getElementById('figure-dialog');
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-zoom]');
  if (!button) return;
  const caption = button.dataset.caption || button.querySelector('img')?.alt || 'Research figure';
  document.getElementById('figure-large').src = button.dataset.zoom;
  document.getElementById('figure-large').alt = caption;
  document.getElementById('figure-caption').textContent = caption;
  document.getElementById('figure-original').href = button.dataset.zoom;
  dialog.classList.toggle("is-evolution", Boolean(button.dataset.evolution));
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const tasks = {"pusht":"PushT","tworoom":"TwoRoom","reacher":"Reacher","cube":"Cube","pointmaze":"PointMaze","cube-double":"Cube-Double","scene":"Scene","antmaze-medium":"AntMaze","humanoidmaze-medium":"HumanoidMaze","puzzle-3x3":"Puzzle-3x3"};
document.querySelectorAll('[data-task]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.task;
    document.querySelectorAll('[data-task]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-task-label]').forEach(item => { item.textContent = tasks[key]; });
    ['spaces', 'diagnostics'].forEach(type => {
      const path = `assets/${key}-${type}-20261004.webp`;
      const img = document.getElementById(`${type}-image`);
      img.src = path;
      img.alt = `${tasks[key]}: ${type === 'spaces' ? 'frozen visual features, control representations, symmetric coordinates, and directed potentials.' : 'temporal calibration, symmetric and directed costs, and one-step progress on held-out state–goal pairs.'}`;
      const zoom = document.getElementById(`${type}-open`);
      zoom.dataset.zoom = path;
      zoom.dataset.caption = img.alt;
    });
  });
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const evolutionToggle = document.getElementById('evolution-toggle');
function showEvolutionFinal(final) {
  evolutionToggle.setAttribute('aria-pressed', String(final));
  evolutionToggle.textContent = final ? 'Play training evolution' : 'Show final checkpoint';
  document.querySelectorAll('[data-evolution]').forEach(button => {
    const task = button.dataset.evolution;
    const path = `assets/${task}-evolution${final ? '-poster' : ''}-20261004.${final ? 'webp' : 'gif'}`;
    // The explicit control takes precedence over the initial motion preference.
    button.querySelector('source').media = 'not all';
    button.querySelector('img').src = path;
    button.dataset.zoom = path;
  });
}
if (reducedMotion.matches) showEvolutionFinal(true);
evolutionToggle.addEventListener('click', () => showEvolutionFinal(evolutionToggle.getAttribute('aria-pressed') !== 'true'));
reducedMotion.addEventListener('change', event => showEvolutionFinal(event.matches));
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  tabs.forEach(item => {const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; document.getElementById(item.dataset.panel).hidden = !active;});
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {event.preventDefault(); activateTab(tabs[next]); tabs[next].focus();}
  });
});

const controlRows = [
  ['LeWM',[[13.3,1.2],[50.7,2.3],[56.7,6.4],[32.0,6.0],[82.0,2.0],[24.7,1.2]]],
  ['GCBC',[[28.7,3.1],[44.7,2.3],[48.7,5.0],[28.0,3.5],[83.3,3.1],[35.3,3.1]]],
  ['GC-IQL',[[16.0,2.0],[48.0,5.3],[51.3,9.0],[30.0,5.3],[84.0,2.0],[31.3,5.0]]],
  ['HILP',[[22.7,4.6],[43.3,5.8],[50.0,7.2],[28.7,3.1],[81.3,4.2],[40.0,6.9]]],
  ['GC-IDM',[[28.0,5.3],[38.7,4.6],[48.7,10.3],[30.0,3.5],[88.0,2.0],[33.3,2.3]]],
  ['DTRC',[[11.3,3.1],[54.7,8.3],[53.3,4.2],[31.3,4.6],[84.7,5.0],[40.0,5.3]]],
];
const componentRows = [
  ['Flow BC',[[74.7,4.6],[94.7,4.2],[68.0,3.5],[91.3,1.2]]],
  ['+ temporal supervision',[[84.0,5.3],[100.0,0.0],[100.0,0.0],[97.3,3.1]]],
];
function populateTable(id, rows) {
  const tbody = document.querySelector(`#${id} tbody`);
  const maximum = rows[0][1].map((_, i) => Math.max(...rows.map(row => row[1][i][0])));
  const second = maximum.map((_, i) => [...new Set(rows.map(row => row[1][i][0]))].sort((a,b) => b-a)[1]);
  rows.forEach(([name, values]) => {
    const tr = document.createElement('tr');
    if (name === 'DTRC' || name === '+ temporal supervision') tr.className = 'ours';
    const label = document.createElement('th'); label.scope = 'row'; label.textContent = name; tr.append(label);
    values.forEach(([mean, sd], i) => {
      const td = document.createElement('td');
      const value = document.createElement(mean === maximum[i] ? 'strong' : 'span');
      value.textContent = `${mean.toFixed(1)} ± ${sd.toFixed(1)}`;
      if (id === 'six-task-table' && mean === second[i]) value.classList.add('runner-up');
      td.append(value); tr.append(td);
    });
    tbody.append(tr);
  });
}
populateTable('six-task-table', controlRows);
populateTable('component-table', componentRows);

