import { useRef } from 'react';
import { Input, InputRef } from './Input';

interface Property {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
}

interface Props {
  prop: Property;
  handlePropertyChange: (id: string, value: string) => void;
  handlePropertyNameChange: (id: string, name: string) => void;
  handlePropertyToggle: (id: string) => void;
  onRemove: () => void;
  cssProperties: string[];
  cssValues: Record<string, string[]>;
  commonValues: string[];
}

export function PropertyInputRow({
  prop,
  handlePropertyChange,
  handlePropertyNameChange,
  handlePropertyToggle,
  onRemove,
  cssProperties,
  cssValues,
  commonValues,
}: Props) {
  const nameInputRef = useRef<InputRef>(null);
  const valueInputRef = useRef<InputRef>(null);

  const focusValueInput = () => {
    valueInputRef.current?.focus();
  };

  const focusNameInput = () => {
    nameInputRef.current?.focus();
  };

  return (
    <div key={prop.id} className="flex items-center gap-3 group">
      {/* Enable/disable checkbox */}
      <input
        type="checkbox"
        checked={prop.enabled}
        onChange={() => handlePropertyToggle(prop.id)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 p-0 m-0"
      />

      <div className="flex-1 min-w-0 flex items-center">
        <Input
          ref={nameInputRef}
          id={prop.id}
          value={prop.name}
          enabled={prop.enabled}
          onChangeValue={handlePropertyNameChange}
          textClass={prop.enabled ? 'text-red-400' : ''}
          suggestions={cssProperties}
          placeholder=""
          onTabNext={focusValueInput}
        />
        :&nbsp;
        <Input
          ref={valueInputRef}
          id={prop.id}
          value={prop.value}
          enabled={prop.enabled}
          onChangeValue={handlePropertyChange}
          suggestions={cssValues[prop.name] || commonValues}
          placeholder=""
          onTabNext={() => {
            // For now, just stay in the current row
            // Could be enhanced to move to next property row later
          }}
          onTabPrev={focusNameInput}
        />
        ;
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
        title="Remove property"
      >
        ×
      </button>
    </div>
  );
}
