const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced) {
  document.querySelectorAll<HTMLElement>('.section').forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll<HTMLElement>('.section').forEach((el) => observer.observe(el));
}
