import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useReservationStore } from '../../stores'
import { Button, Input, Card } from '../../components'

const RestaurantDetail: React.FC = () => {
  const { createReservation } = useReservationStore()
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [requests, setRequests] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDateInput = (e: { detail: { value: string } }) => {
    setDate(e.detail.value)
  }

  const handleTimeSlotInput = (e: { detail: { value: string } }) => {
    setTimeSlot(e.detail.value)
  }

  const handleNameInput = (e: { detail: { value: string } }) => {
    setName(e.detail.value)
  }

  const handlePhoneInput = (e: { detail: { value: string } }) => {
    setPhone(e.detail.value)
  }

  const handleRequestsInput = (e: { detail: { value: string } }) => {
    setRequests(e.detail.value)
  }

  const handleReserve = async () => {
    if (!date || !timeSlot || !name || !phone) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      await createReservation({
        reservationDate: date,
        timeSlot,
        customer: { name, phone },
        specialRequests: requests,
      })
      Taro.showToast({ title: '预约成功', icon: 'success' })
      Taro.navigateBack()
    } catch (error) {
      Taro.showToast({ title: '预约失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView scrollY className='h-full bg-gray-100'>
      <View className='p-4'>
        <Card>
          <Text className='text-xl font-bold mb-2'>餐厅名称</Text>
          <Text className='text-gray-600 mb-2'>餐厅描述信息</Text>
          <Text className='text-gray-500'>营业时间: 10:00-22:00</Text>
        </Card>
        <View className='mt-6'>
          <Text className='text-lg font-semibold mb-4'>预约信息</Text>
          <Card className='mb-4'>
            <Input
              label='预约日期'
              placeholder='请选择日期'
              value={date}
              onInput={handleDateInput}
            />
            <Input
              label='预约时间'
              placeholder='请选择时间段'
              value={timeSlot}
              onInput={handleTimeSlotInput}
            />
            <Input
              label='姓名'
              placeholder='请输入姓名'
              value={name}
              onInput={handleNameInput}
            />
            <Input
              label='手机号'
              placeholder='请输入手机号'
              value={phone}
              onInput={handlePhoneInput}
            />
            <Input
              label='特殊要求'
              placeholder='选填'
              value={requests}
              onInput={handleRequestsInput}
            />
          </Card>
          <Button
            onClick={handleReserve}
            loading={loading}
            className='w-full h-12'
          >
            确认预约
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

export default RestaurantDetail
