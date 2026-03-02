import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Input } from '../../components'
import { useUserStore } from '../../stores'

const Register: React.FC = () => {
  const { login } = useUserStore()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePhoneInput = (e: { detail: { value: string } }) => {
    setPhone(e.detail.value)
  }

  const handleCodeInput = (e: { detail: { value: string } }) => {
    setCode(e.detail.value)
  }

  const handlePasswordInput = (e: { detail: { value: string } }) => {
    setPassword(e.detail.value)
  }

  const handleConfirmPasswordInput = (e: { detail: { value: string } }) => {
    setConfirmPassword(e.detail.value)
  }

  const handleRegister = async () => {
    if (!phone || !code || !password) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    if (password !== confirmPassword) {
      Taro.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      // Mock registration
      await login(phone, password)
      Taro.showToast({ title: '注册成功', icon: 'success' })
      Taro.switchTab({ url: '/pages/index/index' })
    } catch (error) {
      Taro.showToast({ title: '注册失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='min-h-screen bg-gray-100 p-6'>
      <View className='bg-white rounded-xl p-6'>
        <Text className='text-2xl font-bold mb-6'>注册</Text>
        <Input
          label='手机号'
          placeholder='请输入手机号'
          value={phone}
          onInput={handlePhoneInput}
        />
        <Input
          label='验证码'
          placeholder='请输入验证码'
          value={code}
          onInput={handleCodeInput}
        />
        <Input
          label='密码'
          placeholder='请输入密码'
          password
          value={password}
          onInput={handlePasswordInput}
        />
        <Input
          label='确认密码'
          placeholder='请再次输入密码'
          password
          value={confirmPassword}
          onInput={handleConfirmPasswordInput}
        />
      </View>
      <View className='mt-6'>
        <Button
          onClick={handleRegister}
          loading={loading}
          className='w-full h-12'
        >
          注册
        </Button>
      </View>
      <View className='mt-4 text-center'>
        <Text className='text-gray-600'>
          已有账号？
          <Text className='text-blue-500' onClick={() => Taro.navigateBack()}>
            去登录
          </Text>
        </Text>
      </View>
    </View>
  )
}

export default Register
