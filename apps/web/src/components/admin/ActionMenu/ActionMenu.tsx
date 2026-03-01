import { For, Show, createSignal, JSX } from "solid-js";
import { type ActionConfig } from "~/lib/types";

interface ActionMenuProps {
  actions: ActionConfig[];
}

export const ActionMenu = (props: ActionMenuProps) => {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [confirmDialog, setConfirmDialog] = createSignal<{
    action: ActionConfig;
  } | null>(null);

  const primaryActions = () => props.actions.filter((a) => !a.dropdown);
  const dangerActions = () => props.actions.filter((a) => a.dropdown);

  const handleAction = (action: ActionConfig) => {
    if (action.type === "danger") {
      setConfirmDialog({ action });
    } else {
      action.onClick();
      setMenuOpen(false);
    }
  };

  const confirmAction = () => {
    confirmDialog()?.action.onClick();
    setConfirmDialog(null);
    setMenuOpen(false);
  };

  const cancelConfirm = () => {
    setConfirmDialog(null);
  };

  return (
    <>
      <div class="flex items-center gap-2">
        <For each={primaryActions()}>
          {(action) => (
            <button
              class={`px-3 py-1 text-sm rounded ${
                action.type === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-[#002f61] hover:bg-[#002f61]/10"
              }`}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </button>
          )}
        </For>

        <Show when={dangerActions().length > 0}>
          <div class="relative">
            <button
              class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setMenuOpen(!menuOpen())}
            >
              更多 ▾
            </button>
            <Show when={menuOpen()}>
              <div class="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-10">
                <For each={dangerActions()}>
                  {(action) => (
                    <button
                      class={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                        action.type === "danger" ? "text-red-600" : ""
                      }`}
                      onClick={() => handleAction(action)}
                    >
                      {action.label}
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>
      </div>

      <Show when={confirmDialog()}>
        <div
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cancelConfirm}
        >
          <div
            class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 class="text-lg font-bold mb-4">确认操作</h3>
            <p class="text-gray-600 mb-6">
              确定要{confirmDialog()?.action.label}吗？
            </p>
            <div class="flex justify-end gap-2">
              <button
                class="px-4 py-2 border rounded hover:bg-gray-50"
                onClick={cancelConfirm}
              >
                取消
              </button>
              <button
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmAction}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};
