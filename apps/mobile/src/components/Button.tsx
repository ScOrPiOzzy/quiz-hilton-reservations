import React from 'react'
import { View, Text } from '@tarojs/components'

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  style,
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all'
  const variantClasses = {
    primary: 'bg-blue-500 text-white active:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 active:bg-gray-300',
    danger: 'bg-red-500 text-white active:bg-red-600',
  }
  const sizeClasses = {
    small: 'h-8 px-3 text-sm',
    medium: 'h-10 px-4 text-base',
    large: 'h-12 px-6 text-lg',
  }

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <View
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} flex items-center justify-center ${className}`}
      onClick={!disabled && !loading ? onClick : undefined}
      style={style}
    >
      {loading ? (
        <View className='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full' />
      ) : (
        <Text>{children}</Text>
      )}
    </View>
  )
}

export default Button
