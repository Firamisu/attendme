import { toast } from "vue-toastflow";

export function successToast(title: string, description?: string) {
  toast.success({
    title,
    description,
  });
}

export function errorToast(title: string, description?: string) {
  toast.error({
    title,
    description,
  });
}

export function infoToast(title: string, description?: string) {
  toast.info({
    title,
    description,
  });
}

export function warningToast(title: string, description?: string) {
  toast.warning({
    title,
    description,
  });
}

