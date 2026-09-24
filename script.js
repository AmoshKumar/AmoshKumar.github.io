(function () {
  "use strict";

  var root = document.documentElement;
  // Lets the CSS know JavaScript is running, so menu and reveal styles only apply then.
  root.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    /* ---------- Mobile menu ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-menu");

    function setMenu(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
      });

      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setMenu(false);
        });
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          setMenu(false);
          toggle.focus();
        }
      });

      // Reset the menu when the window grows to desktop width
      var desktop = window.matchMedia("(min-width: 768px)");
      var onChange = function (event) {
        if (event.matches) setMenu(false);
      };
      if (desktop.addEventListener) {
        desktop.addEventListener("change", onChange);
      } else if (desktop.addListener) {
        desktop.addListener(onChange);
      }
    }

    /* ---------- Header border once the page scrolls ---------- */
    var header = document.querySelector(".site-header");

    function onScroll() {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- Scroll reveal ---------- */
    var revealItems = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("IntersectionObserver" in window && !reduceMotion) {
      var revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealItems.forEach(function (item) {
        revealObserver.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }

    /* ---------- Highlight the nav link for the section in view ---------- */
    var navLinks = document.querySelectorAll(".nav-menu a");
    var sections = [];

    navLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) sections.push({ link: link, target: target });
    });

    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            sections.forEach(function (item) {
              if (item.target === entry.target) {
                item.link.setAttribute("aria-current", "true");
              } else {
                item.link.removeAttribute("aria-current");
              }
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach(function (item) {
        spy.observe(item.target);
      });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
