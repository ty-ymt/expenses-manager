import { DateTime } from "luxon";

const ZONE = "Asia/Tokyo";
const LOCALE = "ja";

export const DEFAULT_DATE_FORMAT = "yyyy/LL/dd(EEE)";
export const DEFAULT_DATETIME_FORMAT = "yyyy/LL/dd(EEE) HH:mm";
export const INPUT_DATE_FORMAT = "YYYY/MM/DD";

// JST変換（DateTime）
const toJstDateTime = (value: Date | string) => {
  const dt =
    value instanceof Date
      ? DateTime.fromJSDate(value, { zone: "utc" })
      : DateTime.fromISO(value, { zone: "utc" });
  return dt.setZone(ZONE).setLocale(LOCALE);
};

// Date変換(JST)
export const toJstDay = (value: Date | string | null | undefined) => {
  if (!value) return null;
  const dt = toJstDateTime(value).startOf("day");
  return dt.isValid ? dt : null;
};

// フォーマット(yyyy/LL/dd(EEE))
export const formatDate = (
  value: Date | string | null | undefined,
  fmt = DEFAULT_DATE_FORMAT,
  emptyLabel = "未定"
) => {
  return value ? toJstDateTime(value).toFormat(fmt) : emptyLabel;
};

//期間フォーマット(startDate ～ endDate)
export const formatDateRange = (
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
  fmt = DEFAULT_DATE_FORMAT,
  emptyLabel = "未定"
) => {
  const startDate = toJstDay(start);
  const endDate = toJstDay(end);

  if (!startDate && !endDate) return emptyLabel;

  const startLabel = startDate ? startDate.toFormat(fmt) : emptyLabel;
  const endLabel = endDate ? endDate.toFormat(fmt) : emptyLabel;

  if (startDate && endDate && startDate.equals(endDate)) {
    return startLabel;
  }

  return `${startLabel} ～ ${endLabel}`;
};

export const formatDateTime = (
  value: Date | string | null | undefined,
  emptyLabel = "未定",
  fmt = DEFAULT_DATETIME_FORMAT
) => {
  return value ? toJstDateTime(value).toFormat(fmt) : emptyLabel;
};

// JSTの「今日（00:00）」
export const getTodayJst = () => {
  return DateTime.now().setZone(ZONE).startOf("day");
};

//JST日付同士の比較
export const isBeforeToday = (dt: DateTime) => {
  return dt < getTodayJst();
};

export const isAfterToday = (dt: DateTime) => {
  return dt > getTodayJst();
};
