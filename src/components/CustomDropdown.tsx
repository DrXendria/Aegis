import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  width?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, width = '150px' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0] || { label: 'Select' };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width }}>
      <div 
        className="neon-input" 
        style={{ 
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer', 
          padding: '10px 16px', 
          borderRadius: '12px',
          userSelect: 'none',
          border: isOpen ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ fontSize: '14px' }}>{selectedOption.label}</span>
        <ChevronDown size={16} style={{ color: 'var(--text-secondary)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: 'rgba(20, 20, 25, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 50,
          maxHeight: '220px',
          overflowY: 'auto',
          animation: 'slide-up 0.2s ease-out'
        }}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: option.value === value ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: option.value === value ? 'rgba(255,255,255,0.05)' : 'transparent',
                transition: 'background 0.2s, color 0.2s'
              }}
              onMouseOver={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseOut={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={14} style={{ color: '#4CC38A' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
