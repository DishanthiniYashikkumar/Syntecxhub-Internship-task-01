/* ==========================================================================
   VELMORA RESORT & SPA — Landing Page Interactions
   --------------------------------------------------------------------------
   1. Sticky header (solid background on scroll)
   2. Mobile menu (open / close / keyboard support)
   3. Active navigation link while scrolling
   4. Scroll reveal animations
   5. Animated statistics counters
   6. Lightweight parallax
   7. Booking form (date rules + friendly confirmation)
   8. Newsletter form
   9. Footer year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Respect visitors who prefer less motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ------------------------------------------------------------------------
     1. STICKY HEADER
     Adds .is-scrolled once the page moves, which fades in the frosted bar.
     ------------------------------------------------------------------------ */
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });


  /* ------------------------------------------------------------------------
     2. MOBILE MENU
     ------------------------------------------------------------------------ */
  function openMenu() {
    header.classList.add('menu-open');
    document.body.classList.add('no-scroll');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    header.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function isMenuOpen() {
    return header.classList.contains('menu-open');
  }

  navToggle.addEventListener('click', () => {
    isMenuOpen() ? closeMenu() : openMenu();
  });

  // Close the menu after choosing a link
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (!isMenuOpen()) return;

    // Escape closes the menu and returns focus to the toggle button
    if (event.key === 'Escape') {
      closeMenu();
      navToggle.focus();
    }

    // Keep Tab focus inside the open menu (simple focus trap)
    if (event.key === 'Tab') {
      const focusable = [navToggle, ...navMenu.querySelectorAll('a')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // If the window is resized to desktop width, reset the mobile menu
  window.matchMedia('(min-width: 993px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });


  /* ------------------------------------------------------------------------
     3. ACTIVE NAVIGATION LINK
     Highlights the link for the section currently in the middle of the screen.
     ------------------------------------------------------------------------ */
  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  const navTargets = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' }); // a thin line across the middle of the viewport

  navTargets.forEach((section) => sectionObserver.observe(section));

  // The footer is short, so mark "Contact" active once the page bottom is reached
  window.addEventListener('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) setActiveLink('contact');
  }, { passive: true });


  /* ------------------------------------------------------------------------
     4. SCROLL REVEAL
     Elements with .reveal fade up the first time they enter the viewport.
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate only once
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach((el) => revealObserver.observe(el));
  }


  /* ------------------------------------------------------------------------
     5. STATISTICS COUNTERS
     Counts from 0 to data-target when the number scrolls into view.
     ------------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');

  function formatNumber(value, decimals) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out: fast start, gentle finish
      el.textContent = formatNumber(target * eased, decimals);

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Start every counter at zero (the HTML holds the final value as a fallback)
    counters.forEach((el) => {
      el.textContent = formatNumber(0, parseInt(el.dataset.decimals || '0', 10));
    });

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => counterObserver.observe(el));
  }


  /* ------------------------------------------------------------------------
     6. PARALLAX
     Moves [data-parallax] images slightly slower than the page scroll.
     The value of data-parallax controls the strength (e.g. 0.12).
     ------------------------------------------------------------------------ */
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (!prefersReducedMotion && parallaxElements.length) {
    let ticking = false;

    function updateParallax() {
      parallaxElements.forEach((el) => {
        const section = el.parentElement;
        const rect = section.getBoundingClientRect();

        // Skip work while the section is off-screen
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${distanceFromCenter * -speed}px, 0)`;
      });
      ticking = false;
    }

    // requestAnimationFrame keeps updates in sync with the screen refresh
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateParallax);
    updateParallax();
  }


  /* ------------------------------------------------------------------------
     7. BOOKING FORM
     ------------------------------------------------------------------------ */
  const bookingForm = document.getElementById('booking-form');
  const checkIn = document.getElementById('check-in');
  const checkOut = document.getElementById('check-out');
  const bookingStatus = document.getElementById('booking-status');
  const submitButton = bookingForm.querySelector('.booking__submit');
  const submitLabel = bookingForm.querySelector('.booking__submit-label');

  // Format a Date as YYYY-MM-DD in local time (the format date inputs expect)
  function toInputDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function parseInputDate(value) {
    return new Date(`${value}T00:00:00`);
  }

  function prettyDate(date) {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Sensible defaults: arrive in two weeks, stay three nights
  const today = new Date();
  checkIn.min = toInputDate(today);
  checkIn.value = toInputDate(addDays(today, 14));
  checkOut.min = toInputDate(addDays(today, 15));
  checkOut.value = toInputDate(addDays(today, 17));

  // Check-out must always be at least one night after check-in
  checkIn.addEventListener('change', () => {
    if (!checkIn.value) return;
    const nextDay = toInputDate(addDays(parseInputDate(checkIn.value), 1));
    checkOut.min = nextDay;
    if (!checkOut.value || checkOut.value < nextDay) checkOut.value = nextDay;
  });

  // Clear the error outline as soon as a field is edited
  bookingForm.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('input', () => field.parentElement.classList.remove('is-invalid'));
  });

  function showStatus(message, type) {
    bookingStatus.className = `booking__status is-${type}`;
    bookingStatus.innerHTML = message;
  }

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Basic validation
    const invalidFields = [checkIn, checkOut].filter((field) => !field.value);
    invalidFields.forEach((field) => field.parentElement.classList.add('is-invalid'));

    if (invalidFields.length) {
      showStatus('Please choose your check-in and check-out dates.', 'error');
      invalidFields[0].focus();
      return;
    }

    const arrival = parseInputDate(checkIn.value);
    const departure = parseInputDate(checkOut.value);
    const nights = Math.round((departure - arrival) / 86400000);

    if (nights < 1) {
      checkOut.parentElement.classList.add('is-invalid');
      showStatus('Check-out needs to be at least one night after check-in.', 'error');
      checkOut.focus();
      return;
    }

    // Simulate a short availability search
    const destination = document.getElementById('destination').value;
    const guests = document.getElementById('guests').value;

    submitButton.classList.add('is-loading');
    submitLabel.textContent = 'Searching…';

    setTimeout(() => {
      submitButton.classList.remove('is-loading');
      submitLabel.textContent = 'Search Availability';

      showStatus(
        `<strong>Good news:</strong> rooms are available at ${destination} for ${nights} ${nights === 1 ? 'night' : 'nights'}, ` +
        `${prettyDate(arrival)} – ${prettyDate(departure)}, ${guests}. ` +
        `<a href="#rooms">Choose your room</a> and our reservations team will confirm within 24 hours.`,
        'success'
      );
    }, 900);
  });

  // "Book Your Stay" links: after scrolling to the panel, move focus to the first field
  document.querySelectorAll('a[href="#booking"]').forEach((link) => {
    link.addEventListener('click', () => {
      setTimeout(() => document.getElementById('destination').focus({ preventScroll: true }), 700);
    });
  });


  /* ------------------------------------------------------------------------
     8. NEWSLETTER FORM
     ------------------------------------------------------------------------ */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterStatus = document.getElementById('newsletter-status');

  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = newsletterForm.email;

    if (!email.value.trim() || !email.validity.valid) {
      newsletterStatus.textContent = 'Please enter a valid email address.';
      email.focus();
      return;
    }

    newsletterStatus.textContent = 'Thank you. You’re on the list for our next letter from the coast.';
    newsletterForm.reset();
  });


  /* ------------------------------------------------------------------------
     9. FOOTER YEAR
     ------------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();
});
