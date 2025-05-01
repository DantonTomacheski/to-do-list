import React, { useRef, useEffect } from 'react';

interface ModalTemplateProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  modalId?: string;
  modalTitle?: string;
  preventClose?: boolean;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({ 
  children, 
  isOpen, 
  onClose, 
  modalId,
  modalTitle,
  preventClose = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Track touch for swipe-down to close
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !preventClose) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, preventClose]);
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !preventClose) {
      onClose();
    }
  };
  
  // Handle touch start for swipe-down
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current) return;
    
    // Only allow swipe-down gesture when at the top of the content
    const isAtTop = modalRef.current?.scrollTop === 0;
    if (!isAtTop) return;
    
    touchEndY.current = e.touches[0].clientY;
    
    const yDiff = touchEndY.current - touchStartY.current;
    if (yDiff > 50 && !preventClose) { // Threshold for swipe-down
      touchStartY.current = null;
      touchEndY.current = null;
      onClose();
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    touchStartY.current = null;
    touchEndY.current = null;
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-overlay flex items-end sm:items-center justify-center animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white w-full sm:w-[480px] sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl overflow-auto max-h-[90vh] animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitle ? modalId : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull handle for mobile - indicates swipe to close */}
        <div className="h-1.5 w-12 bg-gray-300 rounded-full mx-auto my-2 sm:hidden"></div>
        
        {children}
      </div>
    </div>
  );
};

export default ModalTemplate;
