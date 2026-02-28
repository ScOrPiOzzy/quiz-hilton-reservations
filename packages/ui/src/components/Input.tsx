import { Component, JSX, splitProps, createMemo, Show } from 'solid-js'
import { clsx } from 'clsx'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize
  type?: InputType
  error?: boolean
  helperText?: string
  errorMessage?: string
  label?: string
  ref?: (el: HTMLInputElement) => void
}

const baseStyles =
  'flex w-full rounded-[4px] border bg-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:placeholder:text-gray-400'

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
}

const errorStyles =
  'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 dark:border-red-400'
const defaultStyles =
  'border-gray-300 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-700 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400'

const labelStyles = 'block text-sm font-medium text-gray-700 mb-1'
const helperTextStyles = 'mt-1 text-sm'
const errorTextStyles = 'text-red-500 dark:text-red-400'
const helperDefaultStyles = 'text-gray-600 dark:text-gray-400'

export const Input: Component<InputProps> = props => {
  const [local, native] = splitProps(props, [
    'size',
    'type',
    'error',
    'helperText',
    'errorMessage',
    'label',
    'class',
    'id',
    'ref',
  ])

  const inputClass = createMemo(() =>
    clsx(
      baseStyles,
      sizeStyles[local.size ?? 'md'],
      local.error ? errorStyles : defaultStyles,
      local.class,
    ),
  )

  const inputId = createMemo(() => local.id ?? `input-${Math.random().toString(36).substr(2, 9)}`)

  const displayText = createMemo(() => local.errorMessage || local.helperText)
  const textClass = createMemo(() =>
    clsx(helperTextStyles, local.error ? errorTextStyles : helperDefaultStyles),
  )

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label for={inputId()} class={labelStyles}>
          {local.label}
        </label>
      </Show>
      <input
        {...native}
        id={inputId()}
        type={local.type ?? 'text'}
        class={inputClass()}
        aria-invalid={local.error}
        aria-describedby={displayText() ? `${inputId()}-description` : undefined}
        ref={local.ref}
      />

      <Show when={displayText()}>
        <p id={`${inputId()}-description`} class={textClass()}>
          {displayText()}
        </p>
      </Show>
    </div>
  )
}
