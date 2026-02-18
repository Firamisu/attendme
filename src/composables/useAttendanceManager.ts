import type {
  AttendanceLog,
  CourseSessionAttendanceRecord,
  CourseSessionListItem,
  TokenResult,
  User,
} from "@/backend/AttendMeBackendClientBase";
import { unwrapError } from "@/helpers/error";
import { errorToast } from "@/helpers/toasts";
import { Backend } from "@/main";
import { useUiStore } from "@/stores/ui";
import { onMounted, onUnmounted, ref } from "vue";
import { toast } from "vue-toastflow";

export function useAttendanceManager(sessionID: number) {
  const attendanceList = ref<CourseSessionAttendanceRecord[]>([]);
  const sessionDetails = ref<CourseSessionListItem | null>(null);
  const uiStore = useUiStore();
  const intervalId = ref<number>();

  async function fetchAttendance(sessionID: number) {
    const response = await Backend.courseSessionAttendanceListGet(sessionID);
    attendanceList.value = response;
  }

  async function fetchSessionDetails(sessionID: number) {
    const details = await Backend.courseTeacherSessionGet(sessionID);
    sessionDetails.value = details;
  }

  async function toggleAttendance(
    courseSessionID?: number,
    attenderUserID?: number,
    present?: boolean,
  ) {
    if (!courseSessionID || !attenderUserID || present === undefined) return;

    try {
      await toast.loading<AttendanceLog[]>(
        Backend.courseSessionAttendanceToggle(
          attenderUserID,
          courseSessionID,
          present,
        ),
        {
          error: (error: unknown) => ({
            title: "Błąd",
            description: unwrapError(error),
          }),
          success: () => ({
            title: "Obecność zaktualizowana",
            description: "Status obecności został pomyślnie zaktualizowany.",
          }),
          loading: {
            title: "Aktualizowanie obecności...",
            description: "Trwa aktualizacja obecności studenta...",
          },
        },
      );

      await fetchAttendance(courseSessionID);
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    }
  }

  onMounted(async () => {
    uiStore.showLoading("Ładowanie danych sesji...");
    try {
      await Promise.all([
        fetchSessionDetails(sessionID),
        fetchAttendance(sessionID),
      ]);
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    } finally {
      uiStore.hideLoading();
    }

    intervalId.value = setInterval(() => {
      try {
        fetchAttendance(sessionID);
      } catch (err: unknown) {
        errorToast("Błąd", unwrapError(err));
      }
    }, 5000);
  });

  onUnmounted(() => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
  });

  return {
    attendanceList,
    sessionDetails,
    toggleAttendance,
  };
}

export function attendanceTicketGenerator() {
  const currentTicket = ref<string | null>(null);
  const generatorIntervalId = ref<number>();

  const generateNewTicket = async () => {
    try {
      const ticket = await Backend.userAttendanceTicketGet();
      if (!ticket || !ticket.token) {
        throw new Error("Nie można wygenerować biletu obecności");
      }
      currentTicket.value = ticket.token;
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    }
  };

  onMounted(() => {
    generateNewTicket();
    generatorIntervalId.value = setInterval(() => {
      generateNewTicket();
    }, 2000);
  });

  onUnmounted(() => {
    if (generatorIntervalId.value) {
      clearInterval(generatorIntervalId.value);
    }
  });

  return {
    currentTicket,
    generateNewTicket,
  };
}

export function useAttendanceScanner() {
  const scannedUser = ref<User | null>(null);
  const uiStore = useUiStore();

  const generateScannerToken = async (
    courseSessionID: number,
  ): Promise<TokenResult | null> => {
    try {
      uiStore.showLoading("Generowanie tokenu skanera...");
      const response =
        await Backend.courseSessionAttendanceScannerTokenGet(courseSessionID);

      if (response.token == null) throw new Error("Zwrócono pusty token");

      return response;
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
      return null;
    } finally {
      uiStore.hideLoading();
    }
  };

  const authorizeScannerDevice = (token: TokenResult) => {
    Backend.deviceTokenResult = token;

    window.localStorage.setItem(
      "attend-me:deviceAuthData",
      JSON.stringify(toast),
    );
  };

  const processScannedTicket = async (ticket: string) => {
    try {
      await toast.loading(Backend.courseSessionAttendanceRegister(ticket), {
        error: (error: unknown) => ({
          title: "Błąd",
          description: unwrapError(error),
        }),
        success: (val: User) => (
          (scannedUser.value = val),
          {
            title: "Obecność zarejestrowana",
            description: `Obecność użytkownika ${val.name} została pomyślnie zarejestrowana.`,
          }
        ),
        loading: {
          title: "Rejestrowanie obecności...",
          description: "Trwa rejestrowanie obecności...",
        },
      });
    } catch (err: unknown) {
      errorToast("Błąd", unwrapError(err));
    }
  };

  return {
    scannedUser,
    processScannedTicket,
    generateScannerToken,
    authorizeScannerDevice,
  };
}
