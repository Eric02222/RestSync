import React from 'react';
import { PatternFormat } from 'react-number-format';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  required,
  mask, // Use mask string (e.g., '###.###.###-##')
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
            <Icon className="h-5 w-5" />
          </div>
        )}
        {mask ? (
          <PatternFormat
            format={mask}
            mask="_"
            {...props}
            onValueChange={(values) => {
              const { value } = values;
              // Simulate an event object to keep compatibility with onChange
              if (props.onChange) {
                props.onChange({
                  target: {
                    name: props.name,
                    value: value,
                  },
                });
              }
            }}
            getInputRef={ref}
            id={id}
            className={`block w-full rounded-xl border py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 text-sm ${
              Icon ? 'pl-11' : 'pl-4'
            } pr-4 ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/20 dark:bg-red-900/10'
                : 'border-slate-200 bg-white/70 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-blue-500'
            } ${className}`}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            id={id}
            className={`block w-full rounded-xl border py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 text-sm ${
              Icon ? 'pl-11' : 'pl-4'
            } pr-4 ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/20 dark:bg-red-900/10'
                : 'border-slate-200 bg-white/70 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-blue-500'
            } ${className}`}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
