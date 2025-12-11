// main.js — updated for Shaksham Pathak portfolio
(() => {
  // --- Elements (defensive queries) ---
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navItems = document.querySelectorAll(".nav__item");
  const header = document.getElementById("header");

  // Helper: toggle class safely
  function toggleMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle("nav__menu--open");
    changeIcon();
  }

  // Open / close mobile menu
  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  // Close menu when nav item clicked (mobile)
  if (navItems && navItems.length) {
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (navMenu && navMenu.classList.contains("nav__menu--open")) {
          navMenu.classList.remove("nav__menu--open");
        }
        changeIcon();
      });
    });
  }

  // Change nav toggle icon (works with remix icons)
  function changeIcon() {
    if (!navToggle || !navMenu) return;
    if (navMenu.classList.contains("nav__menu--open")) {
      navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
    } else {
      navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
    }
  }

  // --- Smooth scrolling with header offset ---
  // Calculates offset depending on header height (useful for fixed header)
  function getHeaderOffset() {
    const h = header ? header.getBoundingClientRect().height : 88;
    // small screens have slightly smaller header in your styles
    return window.innerWidth >= 968 ? Math.round(h) : Math.round(h * 0.9);
  }

  // Smooth scroll for internal anchors with offset
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = getHeaderOffset();
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });

      // if mobile menu open, close it
      if (navMenu && navMenu.classList.contains("nav__menu--open")) {
        navMenu.classList.remove("nav__menu--open");
        changeIcon();
      }
    });
  });

  // scrollToHireMe helper (if ever used by CTA)
  window.scrollToHireMe = () => {
    // prefer id="hireMe" else fallback to "#contact"
    const hire = document.getElementById("hireMe") || document.getElementById("contact");
    if (!hire) return;
    const offset = getHeaderOffset();
    const top = hire.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // --- Resume download handler ---
  // If you added data-resume attribute on a button or link: <a data-resume href="assets/resume.pdf">
  const resumeEl = document.querySelector('[data-resume]') || document.querySelector('a[href*="resume"]');
  if (resumeEl) {
    resumeEl.addEventListener("click", (e) => {
      // default link behavior will download if href + download attribute present.
      // If it's a button (no href), force navigation to the PDF
      const href = resumeEl.getAttribute("href");
      if (!href) {
        e.preventDefault();
        window.location.href = "/assets/resume.pdf";
      }
      // else let browser handle link (if you included download attribute on anchor)
    });
  }

  // --- Testimonial (Swiper) init only if wrapper exists ---
  try {
    if (document.querySelector(".testimonial__wrapper")) {
      const testimonialSlide = new Swiper(".testimonial__wrapper", {
        loop: true,
        spaceBetween: 30,
        centeredSlides: true,
        effect: "coverflow",
        grabCursor: true,
        slidesPerView: 1,
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          520: {
            slidesPerView: "auto",
          },
        },
      });
    }
  } catch (err) {
    // If Swiper isn't available, don't crash the rest of the script
    // console.warn('Swiper not initialized:', err);
  }

  // --- header scroll animation ---
  window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("header--scroll");
    } else {
      header.classList.remove("header--scroll");
    }
  });

  // --- ScrollReveal animations (if ScrollReveal loaded) ---
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      duration: 2000,
      distance: "100px",
      delay: 400,
      reset: false,
    });

    sr.reveal(".hero__content, .about__content");
    sr.reveal(".hero__img", { origin: "top" });

    sr.reveal(
      ".hero__info-wrapper, .skills__title, .skills__content, .qualification__name, .qualification__item, .service__card, .project__content, .testimonial__wrapper, .footer__content",
      {
        delay: 500,
        interval: 100,
      }
    );

    sr.reveal(".qualification__footer-text, .contact__content", {
      origin: "left",
    });

    sr.reveal(".qualification__footer .btn, .contact__btn", { origin: "right" });
  }

  // --- Set current year in footer (works with different markup) ---
  (function setFooterYear() {
    // 1) If you have <span id="year"></span>
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
      return;
    }

    // 2) If you have a placeholder like "© {currentYear} Name"
    const copyrightEls = document.querySelectorAll(".footer__copyright");
    if (copyrightEls.length) {
      copyrightEls.forEach((el) => {
        const html = el.innerHTML;
        if (html.includes("{currentYear}")) {
          el.innerHTML = html.replace("{currentYear}", new Date().getFullYear());
        } else {
          // if no placeholder, ensure year present once
          if (!html.includes(new Date().getFullYear())) {
            el.innerHTML = `© ${new Date().getFullYear()} ${el.textContent.replace(/©|\d{4}/g, "").trim()}`;
          }
        }
      });
      return;
    }

    // 3) Last fallback: create a small year element in footer
    const footer = document.querySelector("footer");
    if (footer && !footer.querySelector("#year")) {
      const span = document.createElement("span");
      span.id = "year";
      span.textContent = new Date().getFullYear();
      footer.appendChild(span);
    }
  })();

  // small helper to prevent errors when DOM isn't fully ready (if used elsewhere)
  document.addEventListener("DOMContentLoaded", () => {
    // nothing here for now — ready for future hooks
  });
})();
