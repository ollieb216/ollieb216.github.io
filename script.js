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
  // Skip scroll snap on mobile/touch devices
  if (window.matchMedia('(max-width: 768px)').matches) return;

  var hero = document.getElementById('hero');
  var about = document.getElementById('about');
  var isAnimating = false;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function snapTo(el) {
    if (isAnimating) return;
    isAnimating = true;

    var startY = window.scrollY;
    var targetY = el.offsetTop;
    var distance = targetY - startY;
    var duration = 700;
    var startTime = null;

    document.documentElement.style.scrollBehavior = 'auto';

    function animate(now) {
      if (!startTime) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        function pin() { window.scrollTo(0, targetY); }
        window.addEventListener('scroll', pin);
        setTimeout(function () {
          window.removeEventListener('scroll', pin);
          document.documentElement.style.scrollBehavior = '';
          isAnimating = false;
        }, 200);
      }
    }

    requestAnimationFrame(animate);
  }

  // Intercept About nav link so it lands at the exact snap position
  var aboutLink = document.querySelector('a[href="#about"]');
  if (aboutLink) {
    aboutLink.addEventListener('click', function (e) {
      e.preventDefault();
      snapTo(about);
    });
  }

  window.addEventListener('wheel', function (e) {
    if (isAnimating) {
      e.preventDefault();
      return;
    }

    var scrollY = window.scrollY;
    var heroHeight = hero.offsetHeight;
    var aboutTop = about.offsetTop;

    if (scrollY < heroHeight && e.deltaY > 0) {
      e.preventDefault();
      snapTo(about);
      return;
    }

    if (scrollY >= aboutTop && scrollY <= aboutTop + 5 && e.deltaY < 0) {
      e.preventDefault();
      snapTo(hero);
    }
  }, { passive: false });
})();

