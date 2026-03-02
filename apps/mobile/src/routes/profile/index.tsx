import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

interface User {
  name: string;
  email: string;
  memberLevel: string;
  points: number;
}

export default function Profile() {
  const [user] = createSignal<User>({
    name: "张三",
    email: "zhangsan@example.com",
    memberLevel: "金卡会员",
    points: 12500,
  });

  return (
    <div class="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3">
          <h1 class="text-xl font-bold text-gray-900">个人中心</h1>
        </div>
      </div>

      {/* 用户信息卡片 */}
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <div class="flex items-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
              {user().name.charAt(0)}
            </div>
            <div>
              <h2 class="text-xl font-bold">{user().name}</h2>
              <p class="text-blue-100 text-sm">{user().memberLevel}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-blue-400">
            <div class="flex justify-between">
              <span class="text-blue-100">积分</span>
              <span class="text-2xl font-bold">{user().points}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div class="max-w-md mx-auto px-4">
        <div class="bg-white rounded-lg shadow-sm divide-y">
          <A
            href="/profile/info"
            class="flex items-center px-4 py-4 hover:bg-gray-50"
          >
            <span class="text-xl mr-3">👤</span>
            <span class="flex-1">个人信息</span>
            <span class="text-gray-400">›</span>
          </A>
          <A
            href="/profile/reservations"
            class="flex items-center px-4 py-4 hover:bg-gray-50"
          >
            <span class="text-xl mr-3">📋</span>
            <span class="flex-1">我的预约</span>
            <span class="text-gray-400">›</span>
          </A>
          <a
            href="#"
            class="flex items-center px-4 py-4 hover:bg-gray-50"
          >
            <span class="text-xl mr-3">🎁</span>
            <span class="flex-1">会员权益</span>
            <span class="text-gray-400">›</span>
          </a>
          <a
            href="#"
            class="flex items-center px-4 py-4 hover:bg-gray-50"
          >
            <span class="text-xl mr-3">⚙️</span>
            <span class="flex-1">设置</span>
            <span class="text-gray-400">›</span>
          </a>
          <a
            href="/login"
            class="flex items-center px-4 py-4 hover:bg-gray-50 text-red-600"
          >
            <span class="text-xl mr-3">🚪</span>
            <span class="flex-1">退出登录</span>
          </a>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div class="max-w-md mx-auto flex">
          <A
            href="/"
            class="flex-1 flex flex-col items-center py-2 text-gray-600"
          >
            <span class="text-xl">🏨</span>
            <span class="text-xs mt-1">酒店</span>
          </A>
          <A
            href="/profile"
            class="flex-1 flex flex-col items-center py-2 text-blue-600"
          >
            <span class="text-xl">👤</span>
            <span class="text-xs mt-1">我的</span>
          </A>
        </div>
      </div>
    </div>
  );
}
