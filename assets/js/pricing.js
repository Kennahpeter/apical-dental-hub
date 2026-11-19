/* Apical Dental Hub — treatment estimator (pricing.html only)
   The estimator checkboxes AND the price list table are both built from PRICES,
   which the clinic owner edits at /admin (stored in Neon Postgres). */
(function () {
  'use strict';

  var WHATSAPP = '254758593449';

  /* Prices are managed by the clinic owner at /admin and loaded from /api/prices.
     These built-in values are only a fallback if the database can't be reached. */
  var PRICES = {
    bracesPerJaw: 10000,
    extras: [
      { id: 'scaling',    name: 'Scaling & Polishing', price: 3000,  unit: 'per session' },
      { id: 'whitening',  name: 'Teeth Whitening',     price: 15000, unit: 'per session' },
      { id: 'extraction', name: 'Extraction',          price: 2000,  unit: 'per tooth'   },
      { id: 'rootcanal',  name: 'Root Canal',          price: 12000, unit: 'per tooth'   }
    ]
  };

  var BRACES = {
    none:  { label: 'No braces',          jaws: 0 },
    upper: { label: 'Braces (upper jaw)', jaws: 1 },
    lower: { label: 'Braces (lower jaw)', jaws: 1 },
    both:  { label: 'Braces (both jaws)', jaws: 2 }
  };

  var fmt = function (n) { return 'KES ' + Number(n).toLocaleString('en-KE'); };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };

  var bracesSel = document.getElementById('est-braces');
  var extrasBox = document.getElementById('est-extras');
  var totalEl   = document.getElementById('est-total');
  var bookBtn   = document.getElementById('est-book');
  var tableBody = document.getElementById('price-rows');
  if (!bracesSel || !extrasBox || !totalEl || !bookBtn) return;

  function render() {
    /* Fill braces option prices */
    Array.prototype.forEach.call(bracesSel.options, function (opt) {
      var b = BRACES[opt.value];
      if (!opt.dataset.base) opt.dataset.base = opt.textContent;
      opt.textContent = opt.dataset.base + (b && b.jaws ? ' · ' + fmt(b.jaws * PRICES.bracesPerJaw) : '');
    });
    var bracesLabel = document.querySelector('label[for="est-braces"] span');
    if (bracesLabel) bracesLabel.textContent = '· ' + fmt(PRICES.bracesPerJaw) + ' per jaw';

    extrasBox.innerHTML = '';

    /* Build checkboxes */
    PRICES.extras.forEach(function (item) {
      var label = document.createElement('label');
      label.className = 'flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 cursor-pointer transition hover:border-medical/50 has-[:checked]:border-medical has-[:checked]:bg-ice/60';
      label.setAttribute('for', 'x-' + item.id);
      label.innerHTML =
        '<input type="checkbox" class="check" id="x-' + item.id + '" value="' + item.id + '">' +
        '<span class="flex-1 font-semibold text-navy">' + esc(item.name) + '</span>' +
        '<span class="text-sm font-medium text-slate tabular-nums">' + fmt(item.price) + '</span>';
      extrasBox.appendChild(label);
    });

    /* Build price list table from the same data */
    if (tableBody) {
      var rows = [{ name: PRICES.bracesName || 'Braces', price: PRICES.bracesPerJaw, unit: PRICES.bracesUnit || 'per jaw', braces: true }].concat(PRICES.extras);
      rows.unshift({ name: 'Consultation', price: 0, unit: 'first visit' });
      tableBody.innerHTML = rows.map(function (r) {
        return '<tr class="border-t border-slate-100">' +
          '<th scope="row" class="py-5 pr-4 text-left font-semibold text-navy">' + esc(r.name) + '</th>' +
          '<td class="py-5 pr-4 text-slate hidden sm:table-cell">' + esc(r.unit) + '</td>' +
          '<td class="py-5 pl-2 text-right font-semibold tabular-nums whitespace-nowrap ' + (r.price ? 'text-navy' : 'text-medical') + '">' +
            (r.price ? (r.braces ? 'From ' : '') + fmt(r.price) : 'Free') +
          '<span class="block sm:hidden text-xs font-medium text-slate">' + esc(r.unit) + '</span></td>' +
        '</tr>';
      }).join('');
    }
  }

  function selection() {
    var items = [];
    var b = BRACES[bracesSel.value];
    if (b && b.jaws) items.push({ name: b.label, price: b.jaws * PRICES.bracesPerJaw });
    PRICES.extras.forEach(function (x) {
      var cb = document.getElementById('x-' + x.id);
      if (cb && cb.checked) items.push({ name: x.name, price: x.price });
    });
    return items;
  }

  function update() {
    var items = selection();
    var total = items.reduce(function (s, i) { return s + i.price; }, 0);
    var next = fmt(total);
    if (totalEl.textContent !== next) {
      totalEl.textContent = next;
      totalEl.classList.remove('bump'); void totalEl.offsetWidth; totalEl.classList.add('bump');
    }

    var lines = items.length
      ? items.map(function (i) { return '• ' + i.name + ' – ' + fmt(i.price); })
      : ['• Free consultation (help me choose a treatment)'];
    var msg = ['Hello Apical Dental Hub, I would like to book this treatment plan:', '']
      .concat(lines, ['', 'Estimated total: ' + next, '', 'Please confirm a time for my free consultation.'])
      .join('\n');
    bookBtn.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }

  bracesSel.addEventListener('change', update);
  extrasBox.addEventListener('change', update);
  render();
  update();

  /* Load the owner's live prices */
  fetch('/api/prices').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d || !Array.isArray(d.items) || !d.items.length) return;
    var braces = d.items.filter(function (i) { return i.id === 'braces'; })[0];
    if (braces) { PRICES.bracesPerJaw = braces.price; PRICES.bracesName = braces.name; PRICES.bracesUnit = braces.unit; }
    PRICES.extras = d.items.filter(function (i) { return i.id !== 'braces'; });
    var keep = {}; extrasBox.querySelectorAll('input:checked').forEach(function (c) { keep[c.value] = true; });
    render();
    Object.keys(keep).forEach(function (id) { var c = document.getElementById('x-' + id); if (c) c.checked = true; });
    update();
  }).catch(function () { /* keep built-in prices */ });
})();
