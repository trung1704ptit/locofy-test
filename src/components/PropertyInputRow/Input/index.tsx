import { useState, useRef } from 'react';

interface CommonInputProps {
  id: string;
  value: string;
  enabled?: boolean;
  onChangeValue: (id: string, value: string) => void;
  textClass?: string;
}

export function Input({
  id,
  value,
  enabled = true,
  onChangeValue,
  textClass = '',
}: CommonInputProps) {
  const [width, setWidth] = useState(value.length || 1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocusing, setIsFocusing] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    setIsFocusing(true);
  };

  const handleBlur = () => {
    onChangeValue(id, inputRef.current?.value ?? value);
    setIsFocusing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWidth(val.length > 0 ? val.length : 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChangeValue(id, inputRef.current?.value ?? value);
      setIsFocusing(false);

      inputRef.current?.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      style={{ width: `${width}ch`, lineHeight: 1 }}
      className={`text-sm border-none rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-tight p-0 m-0 ${
        enabled || isFocusing ? '' : 'opacity-50 text-gray-400 line-through'
      } ${textClass}`}
    />
  );
}
