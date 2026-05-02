import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

const FormField = ({ label, id, type = 'text', placeholder, error, registration }: FormFieldProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-[11px] font-medium text-[#7c838a]">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      {...registration}
      className="h-[38px] rounded-lg bg-[rgba(176,186,195,0.25)] px-4 text-[13px] text-[#121212] outline-none transition-shadow placeholder:text-[#b0bac3] focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
    />
    {error && <p className="text-[10px] text-red-500">{error}</p>}
  </div>
);

export default FormField;
