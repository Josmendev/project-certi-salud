import { toast } from "sonner";
import { Icon } from "../components/Icon";

const TOAST_ICONS = {
  SUCCESS: <Icon.SuccessFill size={32} />,
  ERROR: <Icon.ErrorFill size={32} />,
  WARNING: <Icon.WarningFill size={32} />,
  INFO: <Icon.InfoFill size={32} />,
};

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  title: string;
  description: string | Array<string> | undefined;
  type: ToastType;
}

export const showToast = ({ title, description, type }: ToastProps): void => {
  toast[type](title, {
    description,
    icon: TOAST_ICONS[type.toUpperCase() as keyof typeof TOAST_ICONS],
  });
};
