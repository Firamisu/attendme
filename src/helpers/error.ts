import type {
  ApiException,
  ProblemDetails,
} from "@/backend/AttendMeBackendClientBase";

export function unwrapError(err: unknown): string {
  if (isProblemDetails(err)) {
    return err.title || "Wystąpił błąd";
  } else if (isApiException(err)) {
    return translateStatusCode(err.status);
  } else if (err instanceof Error) {
    return err.message;
  } else if (typeof err === "string") {
    return err;
  } else {
    return "Wystąpił nieznany błąd";
  }
}

function isProblemDetails(err: unknown): err is ProblemDetails {
  return (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    "title" in err &&
    "status" in err
  );
}

function isApiException(err: unknown): err is ApiException {
  return typeof err === "object" && err !== null && "isApiException" in err;
}

function translateStatusCode(status: number): string {
  switch (status) {
    case 400:
      return "Nieprawidłowe dane";
    case 401:
      return "Nieautoryzowany";
    case 403:
      return "Brak dostępu";
    case 404:
      return "Nie znaleziono";
    case 500:
      return "Błąd serwera";
    default:
      if (status >= 400 && status < 500) {
        return `Błąd klienta (${status})`;
      } else if (status >= 500 && status < 600) {
        return `Błąd serwera (${status})`;
      } else {
        return `Nieznany błąd (${status})`;
      }
  }
}
