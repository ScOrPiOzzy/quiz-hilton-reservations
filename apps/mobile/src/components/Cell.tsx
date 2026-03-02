import React from 'react'
import { View, Text } from '@tarojs/components'

export interface CellProps {
  title: string
  value?: string
  onClick?: () => void
  icon?: React.ReactNode
  arrow?: boolean
}

const Cell: React.FC<CellProps> = ({ title, value, onClick, icon, arrow = false }) => {
  return (
    <View
      className='bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100'
      onClick={onClick}
    >
      <View className='flex items-center flex-1'>
        {icon && <View className='mr-3'>{icon}</View>}
        <Text className='text-gray-800'>{title}</Text>
      </View>
      <View className='flex items-center'>
        {value && <Text className='text-gray-500 mr-2'>{value}</Text>}
        {arrow && <Text className='text-gray-400'>›</Text>}
      </View>
    </View>
  )
}

export default Cell
