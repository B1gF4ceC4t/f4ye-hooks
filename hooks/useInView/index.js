import { useEffect, useState } from 'react';
import 'intersection-observer';
import { getTargetElement } from '../utils';

const isInView = el => {
  if (!el) return undefined;

  const viewWith =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const viewHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  const rect = el.getBoundingClientRect();

  if (rect) {
    const { top, bottom, left, right } = rect;
    return bottom > 0 && top <= viewHeight && left <= viewWith && right > 0;
  }

  return false;
};

const useInView = target => {
  const [inView, setInView] = useState(() =>
    isInView(getTargetElement(target))
  );

  useEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return () => {};
    }

    const intersectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      }
    });

    intersectionObserver.observe(el);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [target]);

  return inView;
};

export default useInView;
