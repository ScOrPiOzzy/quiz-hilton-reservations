import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Input } from '../../../components'
import { useUserStore } from '../../../stores'
import Taro from '@tarojs/taro'

const ProfileInfo: React.FC = () => {
  const { user, updateProfile } = useUserStore()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [loading, setLoading] = useState(false)

  const handleFirstNameInput = (e: { detail: { value: string } }) => {
    setFirstName(e.detail.value)
  }

  const handleLastNameInput = (e: { detail: { value: string } }) => {
    setLastName(e.detail.value)
  }

  const handleEmailInput = (e: { detail: { value: string } }) => {
    setEmail(e.detail.value)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ firstName, lastName, email })
      Taro.showToast({ title: '保存成功', icon: 'success' })
      Taro.navigateBack()
    } catch (error) {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-100 p-6">
      <View className="bg-white rounded-xl p-4">
        <Text className="text-xl font-bold mb-4">编辑个人信息</Text>
        <Input
          label="姓"
          placeholder="请输入姓"
          value={lastName}
          onInput={handleLastNameInput}
        />
        <Input
          label="名"
          placeholder="请输入名"
          value={firstName}
          onInput={handleFirstNameInput}
        />
        <Input
          label="邮箱"
          placeholder="请输入邮箱"
          value={email}
          onInput={handleEmailInput}
        />
      </View>
      <View className="mt-6">
        <Button
          onClick={handleSave}
          loading={loading}
          className="w-full h-12"
        >
          保存
        </Button>
      </View>
    </View>
  )
}

export default ProfileInfo
