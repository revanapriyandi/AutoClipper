import React, { useEffect, useState } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  actions: {
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    disabled?: boolean;
    onClick: () => void;
    danger?: boolean;
  }[];
}

export function ContextMenu({ x, y, onClose, actions }: ContextMenuProps) {
  const [adjustedX, setAdjustedX] = useState(x);
  const [adjustedY, setAdjustedY] = useState(y);

  useEffect(() => {
    // Simple boundary checking
    const width = 200;
    const height = actions.length * 32 + 16;

    let newX = x;
    let newY = y;

    if (x + width > window.innerWidth) newX = window.innerWidth - width - 8;
    if (y + height > window.innerHeight) newY = window.innerHeight - height - 8;

    setAdjustedX(newX);
    setAdjustedY(newY);
  }, [x, y, actions.length]);

  useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="fixed z-50 bg-[#1e1e1e] border border-white/10 rounded-md shadow-xl w-48 py-1 backdrop-blur-md"
      style={{ left: adjustedX, top: adjustedY }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      {actions.map((action, i) => (
        <button
          key={i}
          className={`w-full px-3 py-1.5 text-xs flex items-center gap-2 transition-colors
            ${action.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary/20'}
            ${action.danger && !action.disabled ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10' : 'text-white/80'}
          `}
          disabled={action.disabled}
          onClick={() => {
            if (!action.disabled) {
              action.onClick();
              onClose();
            }
          }}
        >
          {action.icon && <span className="w-3.5 h-3.5">{action.icon}</span>}
          <span className="flex-1 text-left">{action.label}</span>
          {action.shortcut && <span className="text-[9px] text-white/30 tracking-wider font-mono">{action.shortcut}</span>}
        </button>
      ))}
    </div>
  );
}
