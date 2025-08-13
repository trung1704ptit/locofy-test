import { INPUT_SETTINGS, Z_INDEX } from '@/constants';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface CommonInputProps {
  id: string;
  value: string;
  enabled?: boolean;
  onChangeValue: (id: string, value: string) => void;
  textClass?: string;
  suggestions?: string[];
  placeholder?: string;
  onTabNext?: () => void;
  onTabPrev?: () => void;
}

export interface InputRef {
  focus: () => void;
}

export const Input = forwardRef<InputRef, CommonInputProps>(
  (
    {
      id,
      value,
      enabled = true,
      onChangeValue,
      textClass = '',
      suggestions = [],
      placeholder = '',
      onTabNext,
      onTabPrev,
    },
    ref
  ) => {
    const [width, setWidth] = useState(
      value.length > 0
        ? value.length + INPUT_SETTINGS.WIDTH_PADDING
        : INPUT_SETTINGS.MIN_WIDTH
    );
    const [inputValue, setInputValue] = useState(value);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(
      []
    );
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const [isFocusing, setIsFocusing] = useState(false);
    const [hasUserTyped, setHasUserTyped] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    // Filter suggestions based on input
    useEffect(() => {
      console.log('useEffect triggered:', {
        inputValue,
        suggestions: suggestions.length,
        hasSuggestions: suggestions.length > 0,
        hasUserTyped,
      });

      // Only show suggestions if user has typed something AND there's meaningful input
      const hasMeaningfulInput = inputValue && inputValue.trim().length > 0;
      console.log('hasMeaningfulInput:', hasMeaningfulInput);

      if (hasUserTyped && hasMeaningfulInput && suggestions.length > 0) {
        const filtered = suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        );
        console.log('filtered suggestions:', filtered);
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedIndex(0);
      } else {
        console.log('hiding suggestions');
        setShowSuggestions(false);
        setFilteredSuggestions([]);
      }
    }, [inputValue, suggestions, hasUserTyped]);

    // Ensure suggestions are hidden when component mounts with empty value
    useEffect(() => {
      console.log('mount effect - value:', value, 'trimmed:', value?.trim());
      if (!value || !value.trim()) {
        console.log('hiding suggestions on mount');
        setShowSuggestions(false);
        setFilteredSuggestions([]);
      }
    }, [value]);

    // Handle click outside to close suggestions
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          suggestionsRef.current &&
          !suggestionsRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      setIsFocusing(true);
      // Don't auto-show suggestions on focus - only show when user types
    };

    const handleBlur = () => {
      // Delay to allow clicking on suggestions
      setTimeout(() => {
        setShowSuggestions(false);
        setIsFocusing(false);
        onChangeValue(id, inputValue);
      }, INPUT_SETTINGS.BLUR_DELAY);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      // Calculate width based on text length plus some padding
      setWidth(
        val.length > 0
          ? val.length + INPUT_SETTINGS.WIDTH_PADDING
          : INPUT_SETTINGS.MIN_WIDTH
      );
      setHasUserTyped(true); // Mark that user has typed
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (showSuggestions && filteredSuggestions.length > 0) {
          const selectedValue = filteredSuggestions[selectedIndex];
          setInputValue(selectedValue);
          setWidth(selectedValue.length + INPUT_SETTINGS.WIDTH_PADDING);
          setShowSuggestions(false);
          onChangeValue(id, selectedValue);
        } else {
          onChangeValue(id, inputValue);
        }
        setIsFocusing(false);
        inputRef.current?.blur();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (showSuggestions && filteredSuggestions.length > 0) {
          setSelectedIndex(prev =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (showSuggestions && filteredSuggestions.length > 0) {
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        inputRef.current?.blur();
      } else if (e.key === 'Tab') {
        if (showSuggestions && filteredSuggestions.length > 0) {
          e.preventDefault();
          const selectedValue = filteredSuggestions[selectedIndex];
          setInputValue(selectedValue);
          setWidth(selectedValue.length + INPUT_SETTINGS.WIDTH_PADDING);
          setShowSuggestions(false);
          onChangeValue(id, selectedValue);
        }

        // Handle Tab navigation
        if (e.shiftKey) {
          e.preventDefault();
          onTabPrev?.();
        } else {
          e.preventDefault();
          onTabNext?.();
        }
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      setWidth(suggestion.length + INPUT_SETTINGS.WIDTH_PADDING);
      setShowSuggestions(false);
      onChangeValue(id, suggestion);
    };

    console.log('showSuggestions', showSuggestions);

    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ width: `${width}ch`, lineHeight: 1 }}
          className={`text-sm px-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-tight p-0 m-0 ${
            enabled || isFocusing
              ? 'border border-gray-200 focus:border-blue-500'
              : 'border-none opacity-50 text-gray-400 line-through'
          } ${textClass}`}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute w-64 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg text-sm"
            style={{
              top: '100%',
              left: 0,
              zIndex: Z_INDEX.SUGGESTIONS_DROPDOWN,
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 font-mono ${
                  index === selectedIndex
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700'
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
