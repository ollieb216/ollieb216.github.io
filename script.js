/* ========================================
   Dark / Light Theme Toggle
   ======================================== */
(function () {
  var toggle = document.getElementById('theme-toggle');
  var storedTheme = localStorage.getItem('theme');

  // Apply stored preference or default to light
  if (storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
})();

/* ========================================
   Mobile Nav Toggle
   ======================================== */
(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });
})();

/* ========================================
   Active Nav Link on Scroll
   ======================================== */
(function () {
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function onScroll() {
    var scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ========================================
   Hero ↔ About Fling Snap
   ======================================== */
(function () {
  var hero = document.getElementById('hero');
  var about = document.getElementById('about');
  var locked = false;

  function snapTo(y) {
    locked = true;
    window.scrollTo({ top: y, behavior: 'smooth' });
    // Block all wheel events until well after animation ends
    setTimeout(function () { locked = false; }, 1200);
  }

  window.addEventListener('wheel', function (e) {
    if (locked) { e.preventDefault(); return; }

    var scrollY = window.scrollY;
    var heroHeight = hero.offsetHeight;
    var aboutTop = about.offsetTop;

    // In hero zone, scrolling down → snap to about
    if (scrollY < heroHeight * 0.8 && e.deltaY > 0) {
      e.preventDefault();
      snapTo(aboutTop);
      return;
    }

    // Near top of about, scrolling up → snap to hero
    if (scrollY < aboutTop + about.offsetHeight * 0.5 && scrollY > heroHeight * 0.3 && e.deltaY < 0) {
      e.preventDefault();
      snapTo(0);
    }
  }, { passive: false });
})();

