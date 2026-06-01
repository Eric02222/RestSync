import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 tracking-wide mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          className={`block w-full rounded-xl border py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 text-sm ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
              : 'border-slate-200 bg-white/70 focus:border-blue-500 focus:bg-white focus:ring-blue-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
