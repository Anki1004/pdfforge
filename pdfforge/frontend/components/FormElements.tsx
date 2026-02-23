'use client';

interface ProgressProps { value: number; label?: string; }
export function ProgressBar({ value, label }: ProgressProps) {
  if (value <= 0) return null;
  return (
    <div className="mt-3">
      {label && <p className="text-xs text-muted mb-1.5">{label}</p>}
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

type StatusType = 'success' | 'error' | 'info' | 'warning';
interface StatusProps { type: StatusType; message: string; className?: string; }
export function StatusMessage({ type, message, className = '' }: StatusProps) {
  if (!message) return null;
  const icons: Record<StatusType, string> = {
    success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️',
  };
  return (
    <div className={`status-${type} mt-3 ${className}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

// Checkbox-style radio/toggle button group
interface CheckGroupItem { label: string; value: string; }
interface CheckGroupProps {
  items: CheckGroupItem[];
  value: string;
  onChange: (v: string) => void;
  multi?: false;
}
interface MultiCheckGroupProps {
  items: CheckGroupItem[];
  value: Set<string>;
  onChange: (v: Set<string>) => void;
  multi: true;
}
export function CheckGroup(props: CheckGroupProps | MultiCheckGroupProps) {
  if (props.multi) {
    return (
      <div className="flex flex-wrap gap-2">
        {props.items.map(item => {
          const checked = props.value.has(item.value);
          return (
            <button
              key={item.value}
              type="button"
              className={`checkbox-item ${checked ? 'checked' : ''}`}
              onClick={() => {
                const next = new Set(props.value);
                if (checked) next.delete(item.value); else next.add(item.value);
                props.onChange(next);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {props.items.map(item => (
        <button
          key={item.value}
          type="button"
          className={`checkbox-item ${props.value === item.value ? 'checked' : ''}`}
          onClick={() => props.onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// Range slider with live label
interface RangeSliderProps {
  id?: string; label: string; min: number; max: number;
  value: number; onChange: (n: number) => void; suffix: string;
}
export function RangeSlider({ label, min, max, value, onChange, suffix }: RangeSliderProps) {
  return (
    <div>
      <label className="label">{label} — <span className="text-accent">{value}{suffix}</span></label>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

// Color picker with hex input
interface ColorPickerProps { label: string; value: string; onChange: (v: string) => void; }
export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        <input
          type="text" value={value}
          onChange={e => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value); }}
          className="input-field flex-1"
        />
      </div>
    </div>
  );
}
