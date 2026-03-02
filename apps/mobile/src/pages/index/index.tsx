import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, Button } from '../../components'
import { useHotelStore } from '../../stores'
import Taro from '@tarojs/taro'

const Index: React.FC = () => {
  const { hotels } = useHotelStore()

  const handleHotelClick = (hotelId: string) => {
    Taro.navigateTo({ url: `/pages/hotel-detail/index?id=${hotelId}` })
  }

  return (
    <ScrollView scrollY className="h-full bg-gray-100">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">希尔顿酒店</Text>
        <Text className="text-gray-600 mb-6">发现您的理想住宿</Text>
        <View className="space-y-4">
          {hotels.map((hotel) => (
            <Card key={hotel.id} onClick={() => handleHotelClick(hotel.id)}>
              <Text className="text-xl font-bold">{hotel.name}</Text>
              <Text className="text-gray-600 mt-2">{hotel.city}</Text>
              <Text className="text-gray-500 text-sm mt-1">{hotel.address}</Text>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default Index
