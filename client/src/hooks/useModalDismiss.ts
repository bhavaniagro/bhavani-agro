import { useEffect, useRef } from 'react';

/**
 * Hook to dismiss modals on Escape key press or clicking outside the modal content.
 * Handles mouse drag edge cases safely.
 */
export function useModalDismiss(isOpen: boolean, onClose: () => void) {
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseDownInsideRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownInsideRef.current = !!(contentRef.current && contentRef.current.contains(e.target as Node));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (mouseDownInsideRef.current) {
      mouseDownInsideRef.current = false;
      return;
    }
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return { contentRef, handleMouseDown, handleClick };
}
