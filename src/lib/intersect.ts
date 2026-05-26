import { onCleanup } from 'solid-js';

export function createScrollObserver(threshold = 0.3) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  function observe(el: HTMLElement) {
    observer.observe(el);
    onCleanup(() => observer.unobserve(el));
  }

  return { observe };
}
