import React from 'react'
import { View } from '@tarojs/components'

export interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const Card: React.FC<CardProps> = ({ children, onClick, className = '' }) => {
  return (
    <View
      className={`bg-white rounded-xl p-4 shadow-sm ${onClick ? 'cursor-pointer active:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </View>
  )
}

export default Card
