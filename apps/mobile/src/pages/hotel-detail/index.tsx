import React, { useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useHotelStore } from '../../stores'
import { Card } from '../../components'
import Taro, { useRouter } from '@tarojs/taro'

const HotelDetail: React.FC = () => {
  const router = useRouter()
  const { currentHotel, setCurrentHotel } = useHotelStore()
  const hotelId = router.params.id

  useEffect(() => {
    const mockHotel = {
      id: hotelId,
      name: '希尔顿酒店',
      description: '五星级豪华酒店，位于市中心',
      address: '上海市浦东新区陆家嘴',
      city: '上海',
      phone: '021-12345678',
    }
    setCurrentHotel(mockHotel)
  }, [hotelId, setCurrentHotel])

  return (
    <ScrollView scrollY className="h-full bg-gray-100">
      <View className="p-4">
        <Card>
          <Text className="text-2xl font-bold">{currentHotel?.name || '加载中'}</Text>
          <Text className="text-gray-600 mt-2">{currentHotel?.address || ''}</Text>
        </Card>
      </View>
    </ScrollView>
  )
}

export default HotelDetail
