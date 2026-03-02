import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div class="text-center">
        <div class="text-6xl mb-4">🏨</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">页面未找到</h1>
        <p class="text-gray-600 mb-6">
          抱歉，您访问的页面不存在
        </p>
        <A
          href="/"
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          返回首页
        </A>
      </div>
    </div>
  );
}
