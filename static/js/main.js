window.addEventListener('load', function () {
  'use strict';

  var duration = 225;
  var sections = getSections();
  var active;

  function onScroll() {
    var wt = window.pageYOffset;
    var wb = wt + window.innerHeight;

    var data = sections
      .map(function (section) {
        var it = section.element.offsetTop;
        var ib = section.element.offsetHeight + it;

        var v = !((ib < wt) || (it > wb))?
          (Math.min(wb, ib) - Math.max(wt, it)) / (ib - it):
          0;

        return { section: section, v: v };
      })
      .sort(function (a, b) {
        return b.v - a.v;
      });

    if (active === data[0].section) {
      return;
    }

    data
      .forEach(function (item, index) {
        var nav = item.section.nav;

        if (null == nav) {
          return;
        }

        if (!index) {
          active = item.section;

          nav.setAttribute('active', '');
        } else {
          nav.removeAttribute('active');
        }
      });
  }

  function onLoad() {
    var element = find('a[href^=mailto]');

    element.setAttribute('href', getAddress(element.getAttribute('href')));
  }

  function onClick(event) {
    var target = event.target;
    var action = target
      .getAttribute('data-action');

    if ('scroll' === action) {
      scrollToElement(find(target.getAttribute('href')));
      event.preventDefault();
    }
  }

  function find(selector) {
    return document.querySelector(selector);
  }

  function findAll(selector) {
    return Array.prototype.concat
      .apply([], document.querySelectorAll(selector));
  }

  function getSections() {
    return findAll('section')
      .map(function (element) {
        var id = element.id;

        return {
          id: id,
          nav: find('nav a[href="#' + id + '"]'),
          element: element,
        };
      });
  }

  function getAddress(prefix) {
    return [prefix, location.hostname]
      .join('@');
  }

  function scrollToElement(element) {
    var t0 = Date.now()

    if (null == element) {
      return;
    }

    var y0 = window.pageYOffset;
    var y1 = element.offsetTop;

    function onFrame() {
      var progress = Math.min(1.0, (Date.now() - t0) / duration);
      var dy = (y1 - y0) * progress;

      window.scrollTo(0, y0 + dy);

      if (progress < 1.0) {
        window.requestAnimationFrame(onFrame);
      }
    }

    window.requestAnimationFrame(onFrame);
  }

  onLoad();
  onScroll();

  try {
    window.addEventListener('scroll', onScroll, { passive: true });
  } catch (error) {
    window.addEventListener('scroll', onScroll);
  }

  window.addEventListener('click', onClick);
});
