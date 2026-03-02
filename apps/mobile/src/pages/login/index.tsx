import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Input } from '../../components'
import { useUserStore } from '../../stores'

const Login: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useUserStore()

  const handlePhoneInput = (e: { detail: { value: string } }) => {
    setPhone(e.detail.value)
  }

  const handleCodeInput = (e: { detail: { value: string } }) => {
    setCode(e.detail.value)
  }

  const handleSendCode = () => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    Taro.showToast({ title: '验证码已发送', icon: 'success' })
  }

  const handleLogin = async () => {
    if (!phone || !code) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      await login(phone, code)
      Taro.switchTab({ url: '/pages/index/index' })
    } catch (error) {
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = () => {
    Taro.navigateTo({ url: '/pages/register/index' })
  }

  return (
    <View className='min-h-screen bg-white p-6'>
      <View className='mt-16 mb-8'>
        <Text className='text-3xl font-bold'>登录</Text>
        <Text className='text-gray-500 mt-2'>欢迎使用希尔顿预约</Text>
      </View>
      <View>
        <Input
          label='手机号'
          placeholder='请输入手机号'
          value={phone}
          onInput={handlePhoneInput}
        />
        <View className='flex gap-2 mb-4'>
          <View className='flex-1'>
            <Input
              label='验证码'
              placeholder='请输入验证码'
              value={code}
              onInput={handleCodeInput}
            />
          </View>
          <Button
            variant='secondary'
            onClick={handleSendCode}
            className='h-12 self-end'
          >
            获取验证码
          </Button>
        </View>
        <Button
          onClick={handleLogin}
          loading={loading}
          className='w-full h-12'
        >
          登录
        </Button>
      </View>
      <View className='mt-8 text-center'>
        <Text className='text-gray-500'>
          还没有账号？
          <Text className='text-blue-500' onClick={handleRegister}>立即注册</Text>
        </Text>
      </View>
    </View>
  )
}

export default Login
