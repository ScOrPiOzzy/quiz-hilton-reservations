import { A, useLocation } from "@solidjs/router";
import { Building2, CalendarCheck, User } from "lucide-solid";

export function BottomNavigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getItemClass = (path: string) => {
    const baseClass = "flex-1 flex flex-col items-center py-2";
    return isActive(path)
      ? `${baseClass} text-[#002f61]-600`
      : `${baseClass} text-gray-600`;
  };

  return (
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div class="max-w-md mx-auto flex">
        <A href="/" class={getItemClass("/")}>
          <Building2 size={24} />
          <span class="text-xs mt-1">酒店</span>
        </A>
        <A href="/reservations" class={getItemClass("/reservations")}>
          <CalendarCheck size={24} />
          <span class="text-xs mt-1">预约</span>
        </A>
        <A href="/profile" class={getItemClass("/profile")}>
          <User size={24} />
          <span class="text-xs mt-1">我的</span>
        </A>
      </div>
    </div>
  );
}
