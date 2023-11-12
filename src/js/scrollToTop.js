export const scrollToTop = document.addEventListener(
  'DOMContentLoaded',
  function () {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', function () {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });

    scrollToTopBtn.addEventListener('click', function () {
      scrollToTop(1000);
    });

    function scrollToTop(duration) {
      const start = window.pageYOffset;
      const startTime = performance.now();

      function animateScroll(currentTime) {
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, start, -start, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      }

      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animateScroll);
    }
  }
);
