/* =========================================================
   THE DETAILING STUDIO — site scripts (vanilla JS, no deps)
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     CONFIG — placeholders. Replace before going live.
     --------------------------------------------------------- */
  var CONFIG = {
    // Digits only, country code first, no + or spaces (Canada shown as example).
    whatsappNumber: "14165550100",
    whatsappMessage: "Hi! I'd like a quote for a detail through The Detailing Studio website."
  };

  /* ---------------------------------------------------------
     Intro animation
     --------------------------------------------------------- */
  (function intro() {
    var intro = document.getElementById("intro");
    var skipBtn = document.getElementById("skipIntro");
    if (!intro) return;

    var alreadyPlayed = false;
    try { alreadyPlayed = sessionStorage.getItem("tds_intro_played") === "1"; } catch (e) {}

    function hideIntro() {
      intro.classList.add("hide");
      try { sessionStorage.setItem("tds_intro_played", "1"); } catch (e) {}
    }

    if (alreadyPlayed || reduceMotion) {
      hideIntro();
      return;
    }

    var introTimer = setTimeout(hideIntro, 2600);

    skipBtn.addEventListener("click", function () {
      clearTimeout(introTimer);
      hideIntro();
    });
  })();

  /* ---------------------------------------------------------
     Sticky navbar background on scroll
     --------------------------------------------------------- */
  (function navbarScroll() {
    var nav = document.getElementById("navbar");
    if (!nav) return;
    function update() {
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  })();

  /* ---------------------------------------------------------
     Mobile nav toggle
     --------------------------------------------------------- */
  (function mobileNav() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    function close() {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("open");
    }
    function open() {
      toggle.setAttribute("aria-expanded", "true");
      links.classList.add("open");
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();

  /* ---------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     --------------------------------------------------------- */
  (function scrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------------------------------------------------------
     Counter animation
     --------------------------------------------------------- */
  (function counters() {
    var els = document.querySelectorAll(".counter strong[data-count]");
    if (!els.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1200;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    els.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  (function faq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");
      if (!btn || !panel) return;

      panel.style.maxHeight = "0px";

      btn.addEventListener("click", function () {
        var isOpen = item.getAttribute("data-open") === "true";

        // Close any other open item for a clean single-open accordion
        items.forEach(function (other) {
          if (other !== item && other.getAttribute("data-open") === "true") {
            other.setAttribute("data-open", "false");
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
            other.querySelector(".faq-a").style.maxHeight = "0px";
          }
        });

        if (isOpen) {
          item.setAttribute("data-open", "false");
          btn.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = "0px";
        } else {
          item.setAttribute("data-open", "true");
          btn.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  })();

  /* ---------------------------------------------------------
     Booking form submission (Formspree — AJAX, no page reload)
     --------------------------------------------------------- */
  (function bookingForm() {
    var form = document.getElementById("bookingForm");
    var status = document.getElementById("formStatus");
    var submitBtn = document.getElementById("formSubmit");
    if (!form || !status) return;

    function showStatus(message, type) {
      status.textContent = message;
      status.className = "form-status show " + type;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = form.getAttribute("action") || "";
      if (endpoint.indexOf("YOUR_FORM_ID") !== -1) {
        showStatus(
          "Demo mode: this form isn't connected yet. Replace YOUR_FORM_ID in index.html with a real Formspree form ID to accept live submissions.",
          "err"
        );
        return;
      }

      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            showStatus("Thanks — your request has been sent. We'll be in touch shortly.", "ok");
            form.reset();
          } else {
            showStatus("Something went wrong sending your request. Please try again or reach us on WhatsApp.", "err");
          }
        })
        .catch(function () {
          showStatus("Something went wrong sending your request. Please try again or reach us on WhatsApp.", "err");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  })();

  /* ---------------------------------------------------------
     WhatsApp links (floating button)
     --------------------------------------------------------- */
  (function whatsapp() {
    var link = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(CONFIG.whatsappMessage);
    var btn = document.getElementById("whatsappFloat");
    if (btn) btn.setAttribute("href", link);
  })();

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  (function footerYear() {
    var el = document.getElementById("currentYear");
    if (el) el.textContent = new Date().getFullYear();
  })();
})();
