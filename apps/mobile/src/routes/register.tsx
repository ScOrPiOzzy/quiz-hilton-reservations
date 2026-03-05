import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { authApi } from "~/lib";

export default function Register() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [showSuccessModal, setShowSuccessModal] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (password() !== confirmPassword()) {
      setError("密码不一致");
      return;
    }

    setLoading(true);
    setError("");

    const result = await authApi.register({
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      phone: phone(),
      password: password(),
      role: "customer",
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    // 显示成功提示，而不是立即跳转
    setShowSuccessModal(true);
  };

  const handleNavigateToLogin = () => {
    setShowSuccessModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm">
        <div class="max-w-md mx-auto px-4 py-3">
          <A href="/login" class="text-[#002f61]">
            ← 返回
          </A>
        </div>
      </div>

      {/* 注册表单 */}
      <div class="flex-1 flex items-center justify-center px-4 py-6">
        <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">
            创建 Hilton 账户
          </h1>

          {/* 错误提示 */}
          <Show when={error()}>
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error()}
            </div>
          </Show>

          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  姓
                </label>
                <input
                  type="text"
                  value={lastName()}
                  onInput={(e) =>
                    setLastName((e.target as HTMLInputElement).value)
                  }
                  placeholder="姓"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002f61]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  名
                </label>
                <input
                  type="text"
                  value={firstName()}
                  onInput={(e) =>
                    setFirstName((e.target as HTMLInputElement).value)
                  }
                  placeholder="名"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002f61]"
                />
              </div>
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002f61]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                手机号
              </label>
              <input
                type="tel"
                value={phone()}
                onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
                placeholder="138****8888"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002f61]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password()}
                onInput={(e) =>
                  setPassword((e.target as HTMLInputElement).value)
                }
                placeholder="至少8位字符"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002f61]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword()}
                onInput={(e) =>
                  setConfirmPassword((e.target as HTMLInputElement).value)
                }
                placeholder="再次输入密码"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002f61]"
              />
            </div>

            <button
              type="submit"
              disabled={loading()}
              class="w-full bg-[#002f61] text-white py-3 rounded-lg font-medium hover:bg-[#002450] disabled:bg-[#002f61] disabled:cursor-not-allowed"
            >
              {loading() ? "注册中..." : "注册"}
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-gray-600">
            已有账户？
            <A href="/login" class="text-[#002f61] font-medium ml-1">
              立即登录
            </A>
          </div>
        </div>
      </div>

      {/* 注册成功提示模态框 */}
      <Show when={showSuccessModal()}>
        <div
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {}}
        >
          <div
            class="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-green-100 rounded-full">
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">注册成功！</h2>
            <p class="text-gray-600 mb-6">
              您的账户已成功创建，现在可以登录使用 Hilton Hotels 服务。
            </p>
            <button
              onClick={handleNavigateToLogin}
              class="w-full bg-[#002f61] text-white py-3 rounded-lg font-medium"
            >
              前往登录
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
