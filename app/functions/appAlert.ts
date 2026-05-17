export type AppAlertActionVariant = "default" | "destructive";

export interface AppAlertAction {
  label: string;
  onPress?: () => void;
  variant?: AppAlertActionVariant;
}

export interface AppAlertConfig {
  title: string;
  message: string;
  actions: AppAlertAction[];
}

type AppAlertController = (config: AppAlertConfig | null) => void;

let controller: AppAlertController | null = null;

export function registerAppAlertController(
  nextController: AppAlertController | null,
) {
  controller = nextController;
}

export function showAppAlert(
  title: string,
  message: string,
  onConfirm?: () => void,
) {
  controller?.({
    title,
    message,
    actions: [{ label: "OK", onPress: onConfirm }],
  });
}

interface AppConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function showAppConfirm({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: AppConfirmOptions) {
  controller?.({
    title,
    message,
    actions: [
      { label: cancelLabel, onPress: onCancel, variant: "default" },
      { label: confirmLabel, onPress: onConfirm, variant: "destructive" },
    ],
  });
}
