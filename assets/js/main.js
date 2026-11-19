/* Apical Dental Hub — shared JS
   Mobile menu · scroll animations · footer year · active nav link · booking form */
(function () {
  'use strict';

  var WHATSAPP = '254758593449';
  document.documentElement.classList.remove('no-js');

  /* ---------- Active nav link ---------- */
  var file = location.pathname.split('/').pop() || 'index.html';
  if (file.indexOf('.') === -1) file += '.html'; // pretty URLs on Netlify/Vercel: /services -> services.html
  if (file === '.html') file = 'index.html';
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (a.getAttribute('href') === file) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    var setOpen = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      menu.querySelectorAll('a').forEach(function (a) { a.tabIndex = open ? 0 : -1; });
    };
    setOpen(false);
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setOpen(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024) setOpen(false); });
  }

  /* ---------- Live prices on non-pricing pages (owner edits them at /admin) ---------- */
  var priceEls = document.querySelectorAll('[data-price]');
  if (priceEls.length && window.fetch) {
    fetch('/api/prices').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !Array.isArray(d.items)) return;
      var byId = {}; d.items.forEach(function (i) { byId[i.id] = i.price; });
      priceEls.forEach(function (el) {
        var v = byId[el.getAttribute('data-price')];
        if (typeof v === 'number') el.textContent = v.toLocaleString('en-KE');
      });
    }).catch(function () {});
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Scroll fade-up ---------- */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Booking form (contact page) → WhatsApp ---------- */
  var form = document.getElementById('booking-form');
  if (form) {
    var dateInput = form.querySelector('#b-date');
    if (dateInput) {
      var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      dateInput.min = d.toISOString().slice(0, 10);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var v = function (id) { return form.querySelector(id).value.trim(); };
      var date = v('#b-date');
      var niceDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Flexible';
      var msg = [
        'Hello Apical Dental Hub, I would like to book an appointment.',
        '',
        'Name: ' + v('#b-name'),
        'Phone: ' + v('#b-phone'),
        'Service: ' + v('#b-service'),
        'Preferred date: ' + niceDate
      ].join('\n');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
})();
