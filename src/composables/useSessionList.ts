import { onMounted, ref, watch } from "vue";
import { debounce } from "lodash-es";

import { Backend } from "@/main";
import { unwrapError } from "@/helpers/error";
import { useUiStore } from "@/stores/ui";
import { begginingOfDay, endOfDay } from "@/helpers/time";

import type {
  CourseSessionListFilters,
  CourseSessionListFiltersPagedListParams,
  CourseSessionListItem,
  CourseSessionListItemPagedList,
} from "@/backend/AttendMeBackendClientBase";
import type { DateFilterOptionType, GetSessionsFilters } from "@/types/session";
import type { Role } from "@/types/auth";

export function useSessionList(role: Role) {
  const sessions = ref<CourseSessionListItem[]>();
  const latestResponse = ref<CourseSessionListItemPagedList>();
  const uiStore = useUiStore();
  const error = ref<string | null>(null);
  const pageNumber = ref(1);
  const pageSize = ref(8);

  const filters = ref<GetSessionsFilters>({
    search: undefined,
    dateFilter: undefined,
  });

  const canFetchMore = () => {
    return latestResponse.value?.totalPages !== pageNumber.value;
  };

  const fetchMore = async () => {
    if (!canFetchMore()) {
      return;
    }

    pageNumber.value += 1;
    await fetchSessions();
  };

  const fetchSessions = async () => {
    uiStore.showLoading("Ładowanie listy...");
    error.value = null;

    try {
      const response = await sessionFetchByRole[role]({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        filters: buildFilter(filters.value),
      });

      latestResponse.value = response;
      sessions.value = sessions.value
        ? [...sessions.value, ...response.items]
        : response.items;
    } catch (err: unknown) {
      error.value = unwrapError(err);
      sessions.value = undefined;
    } finally {
      uiStore.hideLoading();
    }
  };

  const debouncedFetch = debounce(() => {
    pageNumber.value = 1;
    sessions.value = undefined;
    fetchSessions();
  }, 400);

  watch(
    filters,
    () => {
      debouncedFetch();
    },
    { deep: true },
  );

  onMounted(() => {
    fetchSessions();
  });

  return {
    sessions,
    error,
    fetchMore,
    canFetchMore,
    updateSearch: (value: string) => {
      filters.value.search = value || undefined;
    },
    updateDateFilter: (value: DateFilterOptionType) => {
      filters.value.dateFilter = value;
    },
  };
}

const sessionFetchByRole = {
  teacher: (params: CourseSessionListFiltersPagedListParams | undefined) =>
    Backend.courseTeacherSessionsGet(params),
  student: (params: CourseSessionListFiltersPagedListParams | undefined) =>
    Backend.courseStudentSessionsGet(params),
};

function buildFilter(filter: GetSessionsFilters): CourseSessionListFilters {
  const filters: CourseSessionListFilters = {};

  if (filter.search) {
    filters.search = filter.search;
  }

  if (filter.dateFilter) {
    switch (filter.dateFilter) {
      case "today": {
        filters.dateStart = begginingOfDay(new Date());
        filters.dateEnd = endOfDay(new Date());
        break;
      }
      case "week-ahead": {
        const now = new Date();
        const weekAhead = new Date();
        weekAhead.setDate(now.getDate() + 7);

        filters.dateStart = begginingOfDay(now);
        filters.dateEnd = endOfDay(weekAhead);
        break;
      }
      case "month-ahead": {
        const now = new Date();
        const monthAhead = new Date();
        monthAhead.setMonth(now.getMonth() + 1);

        filters.dateStart = begginingOfDay(now);
        filters.dateEnd = endOfDay(monthAhead);
        break;
      }
      case "future": {
        filters.dateStart = new Date();
        break;
      }
      case "past": {
        filters.dateEnd = endOfDay(new Date());
        break;
      }
    }
  }
  return filters;
}
