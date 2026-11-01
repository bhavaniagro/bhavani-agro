import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  sublabel?: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  error?: boolean | string;
  searchable?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '-- Select option --',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  id,
  error = false,
  searchable
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((o) => o.value === value) || (value ? { value, label: value } : null);
  const displayLabel = selectedOption?.label || placeholder;

  const showSearch = searchable !== undefined ? searchable : normalizedOptions.length > 7;

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 220 && rect.top > 220) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
      if (showSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }
  }, [isOpen, showSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredOptions = searchTerm.trim()
    ? normalizedOptions.filter(
        (o) =>
          o.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (o.sublabel && o.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : normalizedOptions;

  const hasCustomBg = buttonClassName.includes('bg-');
  const hasCustomBorder = buttonClassName.includes('border-');

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between gap-2 p-2 rounded text-xs transition-all text-left cursor-pointer outline-none border ${
          disabled
            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
            : error
            ? 'border-rose-400 bg-rose-50/30 text-neutral-900 focus:border-rose-600 ring-2 ring-rose-500/10'
            : isOpen
            ? `${hasCustomBg ? '' : 'bg-white'} border-neutral-900 ring-2 ring-neutral-900/10 shadow-2xs`
            : `${hasCustomBg ? '' : 'bg-neutral-50'} ${hasCustomBorder ? '' : 'border-neutral-200 hover:border-neutral-400'} text-neutral-800 focus:border-neutral-900`
        } ${buttonClassName}`}
      >
        <span className={`truncate font-medium ${!selectedOption && placeholder ? 'text-neutral-400' : 'text-neutral-800'}`}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-neutral-800' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 p-1.5 text-xs animate-in fade-in duration-150 ${menuClassName}`}
          style={{ minWidth: '100%' }}
        >
          {showSearch && (
            <div className="p-1 mb-1 border-b border-neutral-100">
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent outline-none text-xs text-neutral-800 placeholder-neutral-400"
                />
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto space-y-0.5 overscroll-contain">
            {filteredOptions.length === 0 ? (
              <div className="py-3 px-2 text-center text-neutral-400 text-xs">
                No matches found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'font-semibold text-emerald-800 bg-emerald-50/90 shadow-2xs'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-emerald-600' : 'bg-transparent'}`} />
                      <span className="truncate">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-mono shrink-0">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
