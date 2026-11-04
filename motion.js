(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('js-reveal');

  // 出したい要素：[セレクタ, 追加する向き, 兄弟で時間差をつけるか]
  var targets = [
    ['#features > div > div:first-child', '', false],
    ['#features .flex.flex-col.md\\:flex-row > div:first-child', 'from-left', false],
    ['#features .flex.flex-col.md\\:flex-row-reverse > div:first-child', 'from-right', false],
    ['#features .flex.flex-col.md\\:flex-row > div:last-child', 'zoom', false],
    ['#features .flex.flex-col.md\\:flex-row-reverse > div:last-child', 'zoom', false],
    ['#features .rounded-3xl.px-6.py-10', 'zoom', false],
    ['#demo .demo-wrapper, #demo h2, #demo > div > div:first-child', '', false],
    ['section h2', '', false],
    ['.plan-card', 'zoom', true],
    ['.feature-card', '', true],
    ['#faq details', '', true],
    ['#column-section a[href*="column/"]', '', true],
    ['.btn-primary, .btn-secondary', '', false],
    ['.article-card h2, .article-card figure', '', false]
  ];
  var seen = new Set();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (t) {
    var list;
    try { list = document.querySelectorAll(t[0]); } catch (err) { return; }
    list.forEach(function (el, i) {
      if (seen.has(el)) return;
      // ヒーロー（一番上）のボタンは、最初から見せる
      if (el.closest('.fadein') && !el.closest('#features')) return;
      // 初めは隠れている部分（FAQの残り）や、デモの画面の中は対象外
      if (el.closest('#faq-more') || el.closest('.demo-wrapper') || el.closest('.phone-view')) return;
      seen.add(el);
      el.classList.add('reveal');
      if (t[1]) el.classList.add(t[1]);
      if (t[2]) el.style.setProperty('--d', Math.min(i % 4, 3) * 90 + 'ms');
      io.observe(el);
    });
  });

  // 画面に最初から見えているものは、すぐ表示
  requestAnimationFrame(function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { el.classList.add('in'); io.unobserve(el); }
    });
  });

  // ヘッダーの影
  var header = document.querySelector('header.sticky');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
})();
