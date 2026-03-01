import { toast } from "react-toastify";
import CustomToast from "@/shared/CustomToast";

export const showSuccess = (message: string) =>
  toast(<CustomToast type="success" message={message} />);

export const showError = (message: string) =>
  toast(<CustomToast type="error" message={message} />);

export const showInfo = (message: string) =>
  toast(<CustomToast type="info" message={message} />);

export const showWarn = (message: string) =>
  toast(<CustomToast type="warning" message={message} />);