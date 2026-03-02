import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";

export default function Register() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [name, setName] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (password() !== confirmPassword()) {
      alert("密码不一致");
      return;
    }
    setLoading(true);
    // 模拟注册
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm">
        <div class="max-w-md mx-auto px-4 py-3">
          <A href="/login" class="text-blue-600">
            ← 返回
          </A>
        </div>
      </div>

      {/* 注册表单 */}
      <div class="flex-1 flex items-center justify-center px-4 py-6">
        <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">
            创建 Hilton 账户
          </h1>

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                type="text"
                value={name()}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                placeholder="您的姓名"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={email()}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="your@email.com"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password()}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="至少8位字符"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                placeholder="再次输入密码"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading()}
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading() ? "注册中..." : "注册"}
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-gray-600">
            已有账户？
            <A href="/login" class="text-blue-600 font-medium ml-1">
              立即登录
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}
