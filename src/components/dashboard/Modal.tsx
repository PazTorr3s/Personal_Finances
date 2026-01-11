import type { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal"
        onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        {children}
      </div>
    </div>
  );
}
