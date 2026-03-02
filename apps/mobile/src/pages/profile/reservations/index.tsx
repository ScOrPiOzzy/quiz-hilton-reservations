import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card } from '../../../components'
import { useReservationStore } from '../../../stores'

const Reservations: React.FC = () => {
  const { reservations } = useReservationStore()

  return (
    <ScrollView scrollY className='h-full bg-gray-100'>
      <View className='p-4'>
        <Text className='text-xl font-bold mb-4'>我的预约</Text>
        {reservations.length === 0 ? (
          <View className='bg-white rounded-xl p-8 text-center'>
            <Text className='text-gray-500'>暂无预约记录</Text>
          </View>
        ) : (
          <View className='space-y-4'>
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <Text className='text-lg font-bold'>{reservation.restaurantName}</Text>
                <Text className='text-gray-600 mt-2'>{reservation.hotelName}</Text>
                <Text className='text-gray-600 mt-1'>
                  {reservation.date} {reservation.timeSlot}
                </Text>
                <Text className='text-gray-500 text-sm mt-1'>
                  {reservation.name} - {reservation.phone}
                </Text>
                {reservation.specialRequests && (
                  <Text className='text-gray-500 text-sm mt-1'>
                    备注：{reservation.specialRequests}
                  </Text>
                )}
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default Reservations
