import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { useUserStore } from '../../stores'
import { Cell, Button } from '../../components'
import Taro from '@tarojs/taro'

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useUserStore()

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '确认',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
          Taro.showToast({ title: '已退出登录', icon: 'success' })
        }
      },
    })
  }

  if (!isAuthenticated) {
    return (
      <View className="min-h-screen bg-gray-100 p-6">
        <View className="text-center mt-20">
          <Text className="text-xl mb-4">未登录</Text>
          <Button onClick={handleLogin} className="w-full">
            立即登录
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-100">
      <View className="bg-white p-6 mb-4">
        <View className="flex items-center">
          <View className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <Text className="text-2xl text-white">
              {user?.firstName?.[0] || '?'}
            </Text>
          </View>
          <View className="ml-4">
            <Text className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-gray-500">{user?.phone}</Text>
          </View>
        </View>
        <View className="bg-white">
          <Cell
            label="个人信息"
            showArrow
            onClick={() => Taro.navigateTo({ url: '/pages/profile/info/index' })}
          />
          <Cell
            label="我的预约"
            showArrow
            onClick={() => Taro.navigateTo({ url: '/pages/profile/reservations/index' })}
          />
        </View>
        <View className="mt-4">
          <Button variant="danger" onClick={handleLogout} className="w-full">
            退出登录
          </Button>
        </View>
      </View>
    </View>
  )
}

export default Profile
