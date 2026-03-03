import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { authApi, getUser } from "~/lib";

interface User {
  name: string;
  email: string;
  memberLevel: string;
  points: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const userStr = getUser();
  const userData = userStr ? JSON.parse(userStr) : null;
  
  const [user] = createSignal<User>({
    name: userData ? `${userData.firstName}${userData.lastName}` : "未登录",
    email: userData?.email || "",
    memberLevel: "金卡会员",
    points: 12500,
  });

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  const isLoggedIn = authApi.isAuthenticated();

  return (
    <div class="min-h-screen bg-gray-50 pb-20">
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3">
          <h1 class="text-xl font-bold text-gray-900">个人中心</h1>
        </div>
      </div>

      <div class="max-w-md mx-auto px-4 py-4">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <div class="flex items-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
              {user().name.charAt(0)}
            </div>
            <div>
              <h2 class="text-xl font-bold">{user().name}</h2>
              <Show when={isLoggedIn} fallback={<p class="text-blue-100 text-sm">点击登录</p>}>
                <p class="text-blue-100 text-sm">{user().memberLevel}</p>
              </Show>
            </div>
          </div>
          <Show when={isLoggedIn}>
            <div class="mt-4 pt-4 border-t border-blue-400">
              <div class="flex justify-between">
                <span class="text-blue-100">积分</span>
                <span class="text-2xl font-bold">{user().points}</span>
              </div>
            </div>
          </Show>
        </div>
      </div>

      <div class="max-w-md mx-auto px-4">
        <div class="bg-white rounded-lg shadow-sm divide-y">
          <Show when={isLoggedIn} fallback={
            <A href="/login" class="flex items-center px-4 py-4 hover:bg-gray-50">
              <span class="text-xl mr-3">L</span>
              <span class="flex-1">登录 / 注册</span>
              <span class="text-gray-400">&gt;</span>
            </A>
          }>
            <A href="/profile/info" class="flex items-center px-4 py-4 hover:bg-gray-50">
              <span class="text-xl mr-3">I</span>
              <span class="flex-1">个人信息</span>
              <span class="text-gray-400">&gt;</span>
            </A>
            <A href="/reservations" class="flex items-center px-4 py-4 hover:bg-gray-50">
              <span class="text-xl mr-3">R</span>
              <span class="flex-1">我的预约</span>
              <span class="text-gray-400">&gt;</span>
            </A>
            <a href="#" class="flex items-center px-4 py-4 hover:bg-gray-50">
              <span class="text-xl mr-3">V</span>
              <span class="flex-1">会员权益</span>
              <span class="text-gray-400">&gt;</span>
            </a>
            <a href="#" class="flex items-center px-4 py-4 hover:bg-gray-50">
              <span class="text-xl mr-3">S</span>
              <span class="flex-1">设置</span>
              <span class="text-gray-400">&gt;</span>
            </a>
            <button onClick={handleLogout} class="flex items-center px-4 py-4 hover:bg-gray-50 text-red-600 w-full">
              <span class="text-xl mr-3">O</span>
              <span class="flex-1 text-left">退出登录</span>
              <span class="text-gray-400">&gt;</span>
            </button>
          </Show>
        </div>
      </div>

      <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div class="max-w-md mx-auto flex">
          <A href="/" class="flex-1 flex flex-col items-center py-2 text-gray-600">
            <span class="text-xl">H</span>
            <span class="text-xs mt-1">酒店</span>
          </A>
          <A href="/reservations" class="flex-1 flex flex-col items-center py-2 text-gray-600">
            <span class="text-xl">R</span>
            <span class="text-xs mt-1">预约</span>
          </A>
          <A href="/profile" class="flex-1 flex flex-col items-center py-2 text-blue-600">
            <span class="text-xl">P</span>
            <span class="text-xs mt-1">我的</span>
          </A>
        </div>
      </div>
    </div>
  );
}
