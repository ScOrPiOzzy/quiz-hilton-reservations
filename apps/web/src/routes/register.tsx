import { Component, JSX, Show, createSignal } from "solid-js";
import { debounce, isEmpty } from "lodash-es";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { useNavigate } from "@solidjs/router";
import { IUser, UserRole } from "@repo/schemas";
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
} from "../utils/validation";
import {
  clearFieldError as clearFieldErrorUtil,
  type FormErrors,
} from "../utils/form";
import { APP_CONFIG } from "../lib/config";

/**
 * 注册响应接口
 */
interface RegisterResponse {
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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = createSignal<UserRole>(UserRole.CUSTOMER);
  const [lastName, setLastName] = createSignal("");
  const [firstName, setFirstName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [registerError, setRegisterError] = createSignal("");

  /**
   * 表单验证
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!lastName().trim()) {
      newErrors.lastName = "姓不能为空";
    }

    if (!firstName().trim()) {
      newErrors.firstName = "名不能为空";
    }

    if (!email().trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!isValidEmail(email())) {
      newErrors.email = "邮箱格式不正确";
    }

    if (!phone().trim()) {
      newErrors.phone = "手机号不能为空";
    } else if (!isValidPhone(phone())) {
      newErrors.phone = "请输入正确的手机号";
    }

    if (!password()) {
      newErrors.password = "密码不能为空";
    } else if (!isValidPassword(password())) {
      newErrors.password =
        "密码必须包含大小写字母和至少一个数字或特殊字符，长度8-32位";
    }

    if (!confirmPassword()) {
      newErrors.confirmPassword = "请确认密码";
    } else if (password() !== confirmPassword()) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    if (!role()) {
      newErrors.role = "请选择角色";
    }

    setErrors(newErrors);
    return isEmpty(newErrors);
  };

  /**
   * 注册核心逻辑
   */
  const performRegister = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await fetch(`${APP_CONFIG.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName().trim(),
          lastName: lastName().trim(),
          email: email().trim(),
          phone: phone().trim(),
          password: password(),
          role: role(),
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "注册失败，请稍后重试");
      }

      alert("注册成功！请登录");
      navigate("/login", { replace: true });
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : "注册失败，请稍后重试",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 防抖处理注册请求（300ms）
   */
  const handleRegister = debounce(performRegister, 300);

  /**
   * 表单提交处理
   */
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setRegisterError("");

    if (!validateForm()) {
      return;
    }

    handleRegister();
  };

  /**
   * 清除特定字段的错误
   */
  const clearFieldError = (fieldName: keyof FormErrors) => {
    setErrors(clearFieldErrorUtil(errors(), fieldName));
    if (registerError()) {
      setRegisterError("");
    }
  };

  return (
    <div class="flex min-h-screen bg-white">
      {/* 左侧 - Hilton 品牌介绍 */}
      <aside class="w-1/3 bg-[#002f61] text-white p-8 hidden md:block">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold mb-6">Hilton Hotels</h1>
          <p class="mb-4 text-white/80">
            加入 Hilton Hotels 会员，享受世界级的酒店服务和独特的入住体验。
          </p>
          <div class="space-y-2">
            <h2 class="text-xl font-semibold mb-2">会员特权</h2>
            <ul class="list-disc list-inside space-y-2 text-white/90 pl-4">
              <li>预订折扣与专属优惠</li>
              <li>积分累积与兑换</li>
              <li>会员优先入住服务</li>
              <li>全球 6500+ 酒店通用</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* 右侧 - 注册区域 */}
      <div class="flex-1 bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-lg">
          <div class="bg-white rounded-[4px] shadow-lg p-8">
            <div>
              <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-[#002f61] mb-2">创建账户</h1>
                <p class="text-gray-600 text-sm">
                  所有字段均为必填项。注册即表示您同意我们的服务条款。
                </p>
              </div>

              {/* 错误提示 */}
              <Show when={registerError()}>
                <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-[4px] text-sm">
                  <p class="flex items-center gap-2">
                    <span>{registerError()}</span>
                  </p>
                </div>
              </Show>

              {/* 角色选择 */}
              <div class="flex gap-2 mb-6">
                <button
                  type="button"
                  class={`flex-1 py-3 rounded-[4px] text-sm font-medium transition-colors ${
                    role() === UserRole.CUSTOMER
                      ? "bg-[#002f61] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setRole(UserRole.CUSTOMER);
                    clearFieldError("role");
                  }}
                >
                  客户
                </button>
                <button
                  type="button"
                  class={`flex-1 py-3 rounded-[4px] text-sm font-medium transition-colors ${
                    role() === UserRole.STAFF
                      ? "bg-[#002f61] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setRole(UserRole.STAFF);
                    clearFieldError("role");
                  }}
                >
                  员工
                </button>
                <button
                  type="button"
                  class={`flex-1 py-3 rounded-[4px] text-sm font-medium transition-colors ${
                    role() === UserRole.ADMIN
                      ? "bg-[#002f61] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setRole(UserRole.ADMIN);
                    clearFieldError("role");
                  }}
                >
                  管理员
                </button>
              </div>

              {/* 注册表单 */}
              <form onSubmit={handleSubmit} class="space-y-4">
                {/* 姓名部分 */}
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="姓氏"
                      type="text"
                      placeholder="姓氏"
                      value={lastName()}
                      onInput={(e: IEvent) => {
                        setLastName(e.target.value);
                        clearFieldError("lastName");
                      }}
                      error={!!errors().lastName}
                      errorMessage={errors().lastName}
                    />
                  </div>
                  <div>
                    <Input
                      label="名字"
                      type="text"
                      placeholder="名字"
                      value={firstName()}
                      onInput={(e: IEvent) => {
                        setFirstName(e.target.value);
                        clearFieldError("firstName");
                      }}
                      error={!!errors().firstName}
                      errorMessage={errors().firstName}
                    />
                  </div>
                </div>

                {/* 邮箱 */}
                <div>
                  <Input
                    label="电子邮件"
                    type="email"
                    placeholder="请输入正确的电子邮件地址"
                    value={email()}
                    onInput={(e: IEvent) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    error={!!errors().email}
                    errorMessage={errors().email}
                  />
                </div>

                {/* 国家/地区 - 预设为中国大陆 */}
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    国家/地区
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      value="中国大陆"
                      disabled
                      class="flex w-full h-10 px-4 text-base rounded-[4px] border border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed pr-8"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                      ▼
                    </span>
                  </div>
                </div>

                {/* 手机号 */}
                <div>
                  <div class="relative">
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 pl-3 text-gray-600 text-sm font-medium">
                      +86
                    </div>
                    <Input
                      label="手机号"
                      type="tel"
                      placeholder="请输入手机号"
                      value={phone()}
                      onInput={(e: IEvent) => {
                        setPhone(e.target.value);
                        clearFieldError("phone");
                      }}
                      error={!!errors().phone}
                      errorMessage={errors().phone}
                      class="pl-12"
                    />
                  </div>
                </div>

                {/* 密码 */}
                <div class="relative">
                  <div class="absolute right-0 top-8 z-10">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword())}
                      class="p-1 text-gray-400 hover:text-gray-600 text-sm"
                      aria-label={showPassword() ? "隐藏密码" : "显示密码"}
                    >
                      {showPassword() ? "隐藏" : "显示"}
                    </button>
                  </div>
                  <Input
                    label="密码"
                    type={showPassword() ? "text" : "password"}
                    placeholder="请输入密码"
                    value={password()}
                    onInput={(e: IEvent) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    error={!!errors().password}
                    errorMessage={errors().password}
                    helperText="密码必须包含大小写字母和至少一个数字或特殊字符"
                  />
                </div>

                {/* 确认密码 */}
                <div class="relative">
                  <div class="absolute right-0 top-8 z-10">
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword())
                      }
                      class="p-1 text-gray-400 hover:text-gray-600 text-sm"
                      aria-label={
                        showConfirmPassword() ? "隐藏密码" : "显示密码"
                      }
                    >
                      {showConfirmPassword() ? "隐藏" : "显示"}
                    </button>
                  </div>
                  <Input
                    label="确认密码"
                    type={showConfirmPassword() ? "text" : "password"}
                    placeholder="请再次输入密码"
                    value={confirmPassword()}
                    onInput={(e: IEvent) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    error={!!errors().confirmPassword}
                    errorMessage={errors().confirmPassword}
                  />
                </div>

                {/* 提交按钮 */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading()}
                  class="w-full"
                >
                  {loading() ? "注册中..." : "创建账户"}
                </Button>
              </form>

              {/* 底部链接 */}
              <div class="mt-6 pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-600 text-center">
                  已有账户？
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    class="ml-1 text-[#002f61] hover:underline font-medium"
                  >
                    立即登录
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
