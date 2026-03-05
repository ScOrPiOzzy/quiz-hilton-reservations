import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function AdminIndex() {
  const navigate = useNavigate();

  onMount(() => {
    navigate("/admin/hotels", { replace: true });
  });

  return null;
}
