'use strict';
// Only the visitor's display preference is saved, locally on their device.
const themeChoice = document.querySelector('#theme-choice');
const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)');
let chosenTheme = 'system';
try {
  const saved = localStorage.getItem('leela-portfolio-theme');
  if (saved === 'light' || saved === 'dark') chosenTheme = saved;
} catch (_) { /* The control still works when browser storage is unavailable. */ }
function applyTheme() {
  const dark = chosenTheme === 'dark' || (chosenTheme === 'system' && deviceTheme.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#151c26' : '#f5f6f8';
}
themeChoice.value = chosenTheme;
themeChoice.disabled = false;
themeChoice.addEventListener('change', () => {
  chosenTheme = themeChoice.value;
  try {
    if (chosenTheme === 'system') localStorage.removeItem('leela-portfolio-theme');
    else localStorage.setItem('leela-portfolio-theme', chosenTheme);
  } catch (_) { /* Do not block the rest of the portfolio. */ }
  applyTheme();
});
deviceTheme.addEventListener('change', () => {
  if (chosenTheme === 'system') applyTheme();
});
applyTheme();

// Illustrative, fixed examples. This does not invoke the private Python project.
const examples = {
  failures: {
    rows: [['09:41:02','demo.alex','failed'],['09:41:18','demo.alex','failed'],['09:41:36','demo.alex','failed'],['09:42:04','demo.alex','failed']],
    note: 'Four failed attempts for one account in just over a minute. Check the source, the user’s usual activity, and whether a stale password or automated task could explain it.'
  },
  spray: {
    rows: [['09:41:02','demo.alex','failed'],['09:41:18','demo.sam','failed'],['09:41:36','demo.jules','failed'],['09:42:04','demo.robin','failed']],
    note: 'Failures across several accounts can suggest password spraying if they share a source and fit the time window. These rows alone do not show the source. Check that link before drawing a conclusion.'
  },
  success: {
    rows: [['09:41:02','demo.alex','failed'],['09:41:18','demo.alex','failed'],['09:41:36','demo.alex','failed'],['09:42:04','demo.alex','success']],
    note: 'A success follows three failures. Was it the user correcting a password, or an unexpected login? Compare source, device, MFA activity, and the user’s normal behavior before escalating.'
  }
};
const patternButtons = document.querySelectorAll('[data-pattern]');
patternButtons.forEach(button => button.addEventListener('click', () => {
  const example = examples[button.dataset.pattern];
  if (!example) return;
  patternButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const rows = example.rows.map(values => {
    const row = document.createElement('tr');
    values.forEach((value,index) => {
      const cell = document.createElement('td');
      if (index === 2) {
        const badge = document.createElement('span');
        badge.className = value === 'success' ? 'success' : 'failure';
        badge.textContent = value;
        cell.append(badge);
      } else cell.textContent = value;
      row.append(cell);
    });
    return row;
  });
  document.querySelector('#log-rows').replaceChildren(...rows);
  document.querySelector('#pattern-note').textContent = example.note;
}));
