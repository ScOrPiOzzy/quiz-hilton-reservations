import React from 'react'
import { View, Text, Input as TaroInput } from '@tarojs/components'

export interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onInput?: (e: { detail: { value: string } }) => void
  error?: string
  password?: boolean
  disabled?: boolean
  className?: string
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onInput,
  error,
  password,
  disabled,
  className = '',
}) => {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
        </Text>
      )}
      <TaroInput
        password={password}
        value={value}
        onInput={onInput}
        placeholder={placeholder}
        disabled={disabled}
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      {error && (
        <Text className='text-red-500 text-sm mt-1'>{error}</Text>
      )}
    </View>
  )
}

export default Input
