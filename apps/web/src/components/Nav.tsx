import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();

  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";

  return (
    <nav class="bg-white shadow-sm">
      <ul class="container flex items-center p-0 text-gray-700">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a
            href="/"
            class="block py-2 px-4 text-sm font-medium transition-colors"
          >
            Home
          </a>
        </li>
        <li class={`border-b-2 ${active("/login")} mx-1.5 sm:mx-6`}>
          <a
            href="/login"
            class="block py-2 px-4 text-sm font-medium transition-colors"
          >
            Login
          </a>
        </li>
        <li class={`border-b-2 ${active("/register")} mx-1.5 sm:mx-6`}>
          <a
            href="/register"
            class="block py-2 px-4 text-sm font-medium transition-colors"
          >
            Register
          </a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a
            href="/about"
            class="block py-2 px-4 text-sm font-medium transition-colors"
          >
            About
          </a>
        </li>
      </ul>
    </nav>
  );
}
