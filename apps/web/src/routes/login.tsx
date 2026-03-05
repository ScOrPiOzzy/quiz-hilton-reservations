import { Component, JSX, Show, createSignal } from "solid-js";
import { debounce, isEmpty } from "lodash-es";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { useLocation, useNavigate } from "@solidjs/router";
import { IUser, UserRole, getRoleLabel } from "@repo/schemas";
import { isValidEmail } from "../utils/validation";
import {
  clearFieldError as clearFieldErrorUtil,
  type FormErrors,
} from "../utils/form";
import { APP_CONFIG } from "../lib/config";

/**
 * 登录响应接口
 */
interface LoginResponse {
  token: string;
  user: IUser;
}

/**
 * 输入事件类型
 */
type IEvent = InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = createSignal<UserRole>(UserRole.STAFF);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [rememberMe, setRememberMe] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [loginError, setLoginError] = createSignal("");

  /**
   * 表单验证
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email()) {
      newErrors.email = "请输入正确的邮箱";
    } else if (!isValidEmail(email())) {
      newErrors.email = "邮箱格式不正确";
    }

    if (!password()) {
      newErrors.password = "请输入密码";
    }

    setErrors(newErrors);
    return isEmpty(newErrors);
  };

  /**
   * 登录核心逻辑
   */
  const performLogin = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await fetch(
        `${APP_CONFIG.apiBaseUrl}/auth/login-with-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email(), password: password() }),
        },
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "登录失败， 请检查用户名和密码");
      }

      // 登录成功，存储用户信息
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (rememberMe()) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // 根据角色跳转到相应页面
      const returnUrl = new URLSearchParams(location.search).get("returnUrl");
      const destination = "/admin";
      // returnUrl || (role() === UserRole.ADMIN ? "/admin" : "/dashboard");
      navigate(destination, { replace: true });
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "登录失败，请重新登录",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 防抖处理登录请求（300ms）
   */
  const handleLogin = debounce(performLogin, 300);

  /**
   * 表单提交处理
   */
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) {
      return;
    }

    handleLogin();
  };

  /**
   * 忘记密码处理
   */
  const handleForgotPassword = () => {
    window.alert("暂未开放");
  };

  /**
   * 邮箱输入处理
   */
  const onEmailInput = (e: IEvent) => {
    setEmail(e.target.value);
    setErrors(clearFieldErrorUtil(errors(), "email"));
    if (loginError()) {
      setLoginError("");
    }
  };

  /**
   * 密码输入处理
   */
  const onPasswordInput = (e: IEvent) => {
    setPassword(e.target.value);
    setErrors(clearFieldErrorUtil(errors(), "password"));
    if (loginError()) {
      setLoginError("");
    }
  };

  return (
    <div class="flex min-h-screen bg-white">
      {/* 左侧 - Hilton 品牌介绍 */}
      <aside class="w-1/3 bg-[#002f61] text-white p-8">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold mb-6">Hilton Hotels</h1>
          <p class="mb-4 text-white/80">
            Welcome to Hilton Hotels reservation system. Experience world-class
            hospitality at your fingertips.
          </p>
          <div class="space-y-2">
            <h2 class="text-xl font-semibold mb-2">About Hilton</h2>
            <ul class="list-disc list-inside space-y-2 text-white/90 pl-4">
              <li>Founded in 1919</li>
              <li>Over 6,500 properties worldwide</li>
              <li>18 hotel brands under Hilton umbrella</li>
              <li>Named #1 Best Hotel Company in America</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* 右侧 - 登录区域 */}
      <div class="flex-1 bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md">
          <div class="bg-white rounded-[4px] shadow-lg p-8">
            <div>
              <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-[#002f61] mb-2">登录</h1>
                <p class="text-gray-600 mb-6">所有字段均为必填项。</p>
              </div>

              {/* 角色选择 */}
              <div class="flex gap-2 mb-6">
                <button
                  type="button"
                  class={`flex-1 py-3 rounded-[4px] text-base font-medium transition-colors ${
                    role() === UserRole.STAFF
                      ? "bg-[#002f61] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setRole(UserRole.STAFF)}
                >
                  员工
                </button>
                <button
                  type="button"
                  class={`flex-1 py-3 rounded-[4px] text-base font-medium transition-colors ${
                    role() === UserRole.ADMIN
                      ? "bg-[#002f61] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setRole(UserRole.ADMIN)}
                >
                  管理员
                </button>
              </div>

              {/* 登录表单 */}
              <form onSubmit={handleSubmit} class="space-y-4">
                {/* 错误提示 */}
                <Show when={loginError()}>
                  <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-[4px] text-sm">
                    <p class="flex items-center gap-2">
                      <span>{loginError()}</span>
                    </p>
                  </div>
                </Show>

                <div>
                  <Input
                    label="邮箱"
                    type="email"
                    placeholder="name@example.com"
                    value={email()}
                    onInput={onEmailInput}
                    error={!!errors().email}
                    errorMessage={errors().email}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                    value={password()}
                    onInput={onPasswordInput}
                    error={!!errors().password}
                    errorMessage={errors().password}
                  />
                </div>

                {/* 记住我 & 忘记密码 */}
                <div class="flex items-center justify-between mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe()}
                      onChange={(e) => setRememberMe(e.currentTarget.checked)}
                      class="rounded border-gray-300 text-[#002f61] focus:ring-[#002f61]"
                    />
                    <span class="text-sm text-gray-600">记住我</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    class="text-sm text-[#002f61] hover:underline"
                  >
                    忘记密码？
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading()}
                  class="w-full"
                >
                  {loading() ? "登录中" : "登录"}
                </Button>
              </form>

              <div class="mt-6 pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-600 text-center">
                  还没有账户？
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    class="ml-1 text-[#002f61] hover:underline font-medium"
                  >
                    立即注册
                  </button>
                </p>
                <p class="text-xs text-gray-500 text-center mt-2">
                  {getRoleLabel(role())} Portal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
