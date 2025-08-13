import { Input } from './Input';

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
}

export function PropertyInputRow({
  prop,
  handlePropertyChange,
  handlePropertyNameChange,
  handlePropertyToggle,
}: Props) {
  return (
    <div key={prop.id} className="flex items-center gap-3">
      {/* Enable/disable checkbox */}
      <input
        type="checkbox"
        checked={prop.enabled}
        onChange={() => handlePropertyToggle(prop.id)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 p-0 m-0"
      />

      <div className="flex-1 min-w-0 flex items-center">
        <Input
          id={prop.id}
          value={prop.name}
          enabled={prop.enabled}
          onChangeValue={handlePropertyNameChange}
          textClass={prop.enabled ? 'text-red-400' : ''}
        />
        :&nbsp;
        <Input
          id={prop.id}
          value={prop.value}
          enabled={prop.enabled}
          onChangeValue={handlePropertyChange}
        />
      </div>
    </div>
  );
}
