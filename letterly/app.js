(function () {
  'use strict';

  const DEFAULT_BODY =
`Dear Sir or Madam,

I hereby give notice that I am cancelling my membership at your gym effective at the next possible date. Unfortunately, my schedule no longer allows me to attend training on a regular basis. Thank you for the great workouts we have had.

Please confirm receipt of this cancellation in writing, along with the date on which my contract ends.

The direct-debit authorisation I granted you expires on the effective date of my cancellation.

Thank you very much.`;

  const form = document.getElementById('letter-form');
  const btnReset = document.getElementById('btn-reset');
  const btnPdf = document.getElementById('btn-pdf');
  const btnPrint = document.getElementById('btn-print');

  function todayISO() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  function setDefaults() {
    const f = form;
    f.querySelector('[name="date"]').value = todayISO();
    f.querySelector('[name="body"]').value = DEFAULT_BODY;
  }

  function escapeText(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function bodyToHtml(text) {
    const safe = escapeText(text);
    const paragraphs = safe
      .split(/\n\s*\n/)
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`);
    return paragraphs.join('') || '<p></p>';
  }

  function syncField(name) {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;
    const value = input.value.trim();

    document.querySelectorAll(`[data-field="${name}"]`).forEach(el => {
      if (name === 'body') {
        el.innerHTML = bodyToHtml(value);
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll(`[data-show-if="${name}"]`).forEach(el => {
      el.hidden = !value;
    });
  }

  function syncAll() {
    ['sender_name','sender_street','sender_city','sender_email',
     'member_no','rcv_company','rcv_street','rcv_city',
     'date','subject','body'].forEach(syncField);
  }

  function bind() {
    form.addEventListener('input', e => {
      if (e.target && e.target.name) syncField(e.target.name);
    });
    btnReset.addEventListener('click', () => {
      form.reset();
      setDefaults();
      syncAll();
    });
    btnPrint.addEventListener('click', () => window.print());
    btnPdf.addEventListener('click', () => window.print());
  }

  setDefaults();
  bind();
  syncAll();
})();
