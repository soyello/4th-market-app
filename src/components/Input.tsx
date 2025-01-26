import React from 'react';
import { FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const Input = <T extends FieldValues>({
  id,
  label,
  type = 'text',
  disabled,
  formatPrice,
  register,
  required,
  errors,
}: InputProps<T>) => {
  return (
    <div className='relative w-full'>
      {formatPrice && <span className='absolute text-neutral-700 top-5 left-2'>₩</span>}
      <input
        id={String(id)}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=''
        type={type}
        className={`
        w-full
        peer
        p-4
        pt-6
        font-light
        bg-white
        border-2
        rounded-md
        outline-none
        transition
        disabled:opacity-70
        disabled:cursor-not-allowed
        ${formatPrice ? 'pl-9' : 'pl-4'}
        ${errors[id]?.type ? 'border-rose-500' : 'border-neutral-300'}
        ${errors[id]?.type ? 'focus:border-rose-500' : 'focus:border-black'}
        `}
      />
      <label
        className={`
        absolute
        text-selected
        duration-150
        -translate-y-3
        top-5
        z-10
        origin-[0]
        ${formatPrice ? 'left-9' : 'left-4'}
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id]?.type ? 'text-rose-500' : 'text-zinc-400'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
