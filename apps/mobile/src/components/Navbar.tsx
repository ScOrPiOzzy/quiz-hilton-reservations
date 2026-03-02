import React from 'react'
import { View, Text } from '@tarojs/components'

export interface NavbarProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ title, showBack, onBack }) => {
  return (
    <View className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
      {showBack && (
        <View className="mr-4 text-gray-600" onClick={onBack}>
          <Text>‹</Text>
        </View>
      )}
      <Text className="text-lg font-semibold">{title}</Text>
    </View>
  )
}

export default Navbar
