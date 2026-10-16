/* Apical Dental Hub — treatment estimator (pricing.html only)
   The estimator checkboxes AND the price list table are both built from PRICES below,
   so you only ever update prices in one place. */
(function () {
  'use strict';

  var WHATSAPP = '254758593449';

  /* ============ EDIT PRICES HERE (KES) ============
     Placeholder figures except braces & scaling — confirm with the clinic before going live. */
  var PRICES = {
    bracesPerJaw: 10000,              // confirmed: from KES 10,000 per jaw
    extras: [
      { id: 'scaling',    name: 'Scaling & Polishing', price: 3000,  unit: 'per session' }, // confirmed
      { id: 'whitening',  name: 'Teeth Whitening',     price: 15000, unit: 'per session' }, // placeholder
      { id: 'extraction', name: 'Extraction',          price: 2000,  unit: 'per tooth'   }, // placeholder
      { id: 'rootcanal',  name: 'Root Canal',          price: 12000, unit: 'per tooth'   }  // placeholder
    ]
  };
  /* ================================================= */

  var BRACES = {
    none:  { label: 'No braces',          jaws: 0 },
    upper: { label: 'Braces (upper jaw)', jaws: 1 },
    lower: { label: 'Braces (lower jaw)', jaws: 1 },
    both:  { label: 'Braces (both jaws)', jaws: 2 }
  };

  var fmt = function (n) { return 'KES ' + n.toLocaleString('en-KE'); };

  var bracesSel = document.getElementById('est-braces');
  var extrasBox = document.getElementById('est-extras');
  var totalEl   = document.getElementById('est-total');
  var bookBtn   = document.getElementById('est-book');
  var tableBody = document.getElementById('price-rows');
  if (!bracesSel || !extrasBox || !totalEl || !bookBtn) return;

  /* Fill braces option prices */
  Array.prototype.forEach.call(bracesSel.options, function (opt) {
    var b = BRACES[opt.value];
    if (b && b.jaws) opt.textContent += ' · ' + fmt(b.jaws * PRICES.bracesPerJaw);
  });

  /* Build checkboxes */
  PRICES.extras.forEach(function (item) {
    var label = document.createElement('label');
    label.className = 'flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 cursor-pointer transition hover:border-medical/50 has-[:checked]:border-medical has-[:checked]:bg-ice/60';
    label.setAttribute('for', 'x-' + item.id);
    label.innerHTML =
      '<input type="checkbox" class="check" id="x-' + item.id + '" value="' + item.id + '">' +
      '<span class="flex-1 font-semibold text-navy">' + item.name + '</span>' +
      '<span class="text-sm font-medium text-slate tabular-nums">' + fmt(item.price) + '</span>';
    extrasBox.appendChild(label);
  });

  /* Build price list table from the same data */
  if (tableBody) {
    var rows = [{ name: 'Braces', price: PRICES.bracesPerJaw, unit: 'per jaw' }].concat(PRICES.extras);
    rows.unshift({ name: 'Consultation', price: 0, unit: 'first visit' });
    tableBody.innerHTML = rows.map(function (r) {
      return '<tr class="border-t border-slate-100">' +
        '<th scope="row" class="py-5 pr-4 text-left font-semibold text-navy">' + r.name + '</th>' +
        '<td class="py-5 pr-4 text-slate hidden sm:table-cell">' + r.unit + '</td>' +
        '<td class="py-5 pl-2 text-right font-semibold tabular-nums whitespace-nowrap ' + (r.price ? 'text-navy' : 'text-medical') + '">' +
          (r.price ? (r.name === 'Braces' ? 'From ' : '') + fmt(r.price) : 'Free') +
        '<span class="block sm:hidden text-xs font-medium text-slate">' + r.unit + '</span></td>' +
      '</tr>';
    }).join('');
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
  update();
})();
