import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SelectOption {
    label: string | React.ReactNode;
    value: string;
    disabled?: boolean;
}

interface SelectProps {
    value: string;
    onChange: (val: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}

export function Select({ value, onChange, options, placeholder = "Select...", disabled, className, id }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                id={id}
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between bg-surface-50 dark:bg-surface-800 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200",
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 cursor-pointer shadow-sm hover:shadow-primary/5",
                    !selectedOption && "text-surface-500 dark:text-surface-400",
                    className
                )}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={cn("w-4 h-4 text-surface-500 dark:text-surface-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-surface-50/95 dark:bg-surface-800/95 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden animate-fade-in top-full">
                    <ul className="max-h-60 overflow-auto custom-scrollbar p-1 space-y-0.5">
                        {options.map((option) => {
                            const isSelected = value === option.value;
                            return (
                                <li
                                    key={option.value}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors rounded-lg",
                                        option.disabled 
                                            ? "opacity-50 cursor-not-allowed" 
                                            : "hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-900 dark:text-surface-50",
                                        isSelected && "bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 font-semibold"
                                    )}
                                    onClick={() => {
                                        if (!option.disabled) {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }
                                    }}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {isSelected && <Check className="w-4 h-4 text-primary-500 dark:text-primary-400 shrink-0" />}
                                </li>
                            );
                        })}
                        {options.length === 0 && (
                            <li className="px-3 py-4 text-sm text-center text-surface-500 dark:text-surface-400">
                                No options available
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
