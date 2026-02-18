import type {
  DeviceRegisterDTO,
  User,
} from "@/backend/AttendMeBackendClientBase";
import { Backend } from "@/main";
import { ref } from "vue";
import { useUiStore } from "@/stores/ui";
import { unwrapError } from "@/helpers/error";
import { errorToast, successToast } from "@/helpers/toasts";
import { useRouter } from "vue-router";

export function useUserDevicesList() {
  const userList = ref<User[]>([]);
  const uiStore = useUiStore();

  const fetchUsers = async (userIDs: number[]) => {
    uiStore.showLoading("Ładowanie użytkowników...");
    try {
      const requests = userIDs.map((id) => Backend.userGet(id));
      const responses = await Promise.all(requests);
      userList.value = responses;
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    } finally {
      uiStore.hideLoading();
    }
  };

  const resetDevice = async (userID?: number) => {
    if (!userID) return;

    uiStore.showLoading("Resetowanie urządzenia...");
    try {
      await Backend.userDeviceReset(userID);
      const user = await Backend.userGet(userID);
      // replace user in userList with updated user
      userList.value = userList.value.map((u: User) => {
        if (u.userId === userID) {
          return user;
        }
        return u;
      });

      successToast("Sukces", "Urządzenie zostało zresetowane");
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    } finally {
      uiStore.hideLoading();
    }
  };

  const copyLink = async (userID?: number) => {
    if (!userID) return;

    uiStore.showLoading("Generowanie linku...");
    try {
      const response = await Backend.userDeviceRegisterTokenGet(userID);
      if (!response.token) {
        throw new Error("Nie można wygenerować linku rejestracyjnego");
      }

      const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
      const fullUrl = `${baseUrl}/register-device/${response.token}`;
      await navigator.clipboard.writeText(fullUrl);

      successToast("Sukces", "Link rejestracyjny został skopiowany do schowka");
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    } finally {
      uiStore.hideLoading();
    }
  };

  return {
    userList,
    fetchUsers,
    resetDevice,
    copyLink,
  };
}

export function useDeviceRegistration() {
  const uiStore = useUiStore();
  const router = useRouter();
  
  const registerDevice = async (token: string, dto: DeviceRegisterDTO) => {
    uiStore.showLoading("Rejestrowanie urządzenia...");
    try {
      await Backend.userDeviceRegisterWithToken(token, dto);
      successToast("Sukces", "Urządzenie zostało zarejestrowane");
      router.push({ name: "register-device-success" });
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    } finally {
      uiStore.hideLoading();
    }
  };

  return {
    registerDevice,
  };
}
