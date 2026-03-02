import { Component, JSX, splitProps, createMemo, Show } from 'solid-js'
import { clsx } from 'clsx'
import { LoaderCircle } from 'lucide-solid'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonType = 'button' | 'submit' | 'reset'

// 仿照 antd button
export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: (el: HTMLButtonElement) => void
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonType
  loading?: boolean
  loadingText?: string
  children?: JSX.Element
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-[4px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#002f61] text-white hover:bg-[#003d7f] focus-visible:ring-[#002f61] focus-visible:ring-offset-2',
  secondary:
    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
  ghost:
    'bg-transparent hover:bg-[#002f61] hover:text-white text-gray-700 focus-visible:ring-[#002f61] dark:text-gray-300',
  outline:
    'border border-[#002f61] text-[#002f61] hover:bg-[#002f61] hover:text-white focus-visible:ring-[#002f61] dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
}

export const Button: Component<ButtonProps> = props => {
  const [local, native] = splitProps(props, [
    'variant',
    'size',
    'type',
    'loading',
    'loadingText',
    'children',
    'class',
    'ref',
  ])

  const buttonClass = createMemo(() =>
    clsx(
      baseStyles,
      variantStyles[local.variant ?? 'primary'],
      sizeStyles[local.size ?? 'md'],
      local.class,
    ),
  )

  const isDisabled = createMemo(() => local.loading || native.disabled)

  return (
    <button
      {...native}
      type={local.type ?? 'button'}
      class={buttonClass()}
      disabled={isDisabled()}
      ref={local.ref}
    >
      <Show when={local.loading} fallback={local.children}>
        <>
          <LoaderCircle class="h-4 w-4 animate-spin" />
          {local.loadingText ?? 'Loading...'}
        </>
      </Show>
    </button>
  )
}
