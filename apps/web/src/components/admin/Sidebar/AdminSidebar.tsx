import { createSignal, For, onMount } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";

interface MenuItem {
  key: string;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: "hotels",
    label: "酒店管理",
    path: "/admin/hotels",
  },
  {
    key: "restaurants",
    label: "餐厅管理",
    path: "/admin/restaurants",
  },
  {
    key: "reservations",
    label: "预约管理",
    path: "/admin/reservations",
  },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentMenu = () => {
    const path = location.pathname;
    if (path.includes("/hotels")) return "hotels";
    if (path.includes("/restaurants")) return "restaurants";
    if (path.includes("/reservations")) return "reservations";
    return "";
  };

  return (
    <aside class="w-60 bg-[#002f61] p-4">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-white">Hilton 后台</h1>
      </div>

      <nav class="mb-6">
        <ul class="space-y-2">
          <For each={menuItems}>
            {(item) => (
              <li>
                <button
                  class={`w-full text-left px-4 py-2 rounded transition-colors ${
                    currentMenu() === item.key
                      ? "bg-white text-[#002f61]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              </li>
            )}
          </For>
        </ul>
      </nav>

      <div class="border-t border-white/20 pt-4">
        <button
          class="w-full text-left px-4 py-2 text-white/80 hover:text-white"
          onClick={() => navigate("/login")}
        >
          退出登录
        </button>
      </div>
    </aside>
  );
};
