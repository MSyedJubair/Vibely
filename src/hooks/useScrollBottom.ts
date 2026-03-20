import { useEffect, useRef } from 'react';

export const useScrollToBottom = <T extends HTMLElement>(dependency: number[]) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      // scrollIntoView is often cleaner than setting scrollTop manually
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [dependency]);

  return ref;
};