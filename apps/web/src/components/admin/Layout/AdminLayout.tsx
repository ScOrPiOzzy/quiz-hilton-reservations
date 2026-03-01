import { JSX } from "solid-js";
import { AdminSidebar } from "../Sidebar/AdminSidebar";

interface AdminLayoutProps {
  children: JSX.Element;
}

export const AdminLayout = (props: AdminLayoutProps) => {
  return (
    <div class="flex min-h-[100vh]">
      <AdminSidebar />
      <main class="flex-1 p-6 bg-white">{props.children}</main>
    </div>
  );
};
