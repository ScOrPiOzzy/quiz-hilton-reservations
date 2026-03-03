import { Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { authApi, getUser } from "~/lib";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export default function ProfileInfo() {
  const userStr = getUser();
  const userData = userStr ? JSON.parse(userStr) : null;
  
  const [user] = createSignal<UserInfo>({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    role: userData?.role || "",
  });

  const roleMap: Record<string, string> = {
    customer: "会员",
    admin: "管理员",
    staff: "员工",
  };

  return (
    <div class="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center">
          <A href="/profile" class="text-blue-600 mr-4">←</A>
          <h1 class="text-lg font-bold text-gray-900">个人信息</h1>
        </div>
      </div>

      <Show when={authApi.isAuthenticated()} fallback={
        <div class="max-w-md mx-auto px-4 py-8">
          <div class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="text-5xl mb-4">L</div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">请先登录</h2>
            <p class="text-gray-600 mb-4">登录后查看您的个人信息</p>
            <A href="/login" class="inline-block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
              立即登录
            </A>
          </div>
        </div>
      }>
        <div class="max-w-md mx-auto px-4 py-4">
          {/* 头像 */}
          <div class="bg-white rounded-lg shadow-sm p-6 text-center mb-4">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-3">
              {user().firstName?.charAt(0) || "?"}
            </div>
            <h2 class="text-xl font-bold text-gray-900">
              {user().firstName} {user().lastName}
            </h2>
            <p class="text-gray-500">{roleMap[user().role] || user().role}</p>
          </div>

          {/* 信息列表 */}
          <div class="bg-white rounded-lg shadow-sm">
            <div class="px-4 py-4 border-b">
              <div class="flex justify-between">
                <span class="text-gray-500">姓名</span>
                <span class="text-gray-900">{user().firstName} {user().lastName}</span>
              </div>
            </div>
            <div class="px-4 py-4 border-b">
              <div class="flex justify-between">
                <span class="text-gray-500">邮箱</span>
                <span class="text-gray-900">{user().email || "-"}</span>
              </div>
            </div>
            <div class="px-4 py-4 border-b">
              <div class="flex justify-between">
                <span class="text-gray-500">手机号</span>
                <span class="text-gray-900">{user().phone || "-"}</span>
              </div>
            </div>
            <div class="px-4 py-4">
              <div class="flex justify-between">
                <span class="text-gray-500">账户类型</span>
                <span class="text-gray-900">{roleMap[user().role] || user().role}</span>
              </div>
            </div>
          </div>

          {/* 编辑按钮 */}
          <div class="mt-6">
            <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
              编辑资料
            </button>
          </div>
        </div>
      </Show>

      {/* 底部导航栏 */}
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
