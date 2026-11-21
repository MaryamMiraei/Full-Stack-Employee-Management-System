
const timeZone = process.env.ATTENDANCE_TIME_ZONE || "Asia/Tehran";

export const getLocalDate = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

export const getLocalTimeMinutes = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);

  return hour * 60 + minute;
};

export const getAttendanceStartMinutes = () => {
  const startTime = process.env.ATTENDANCE_START_TIME || "09:00";
  const [hour, minute] = startTime.split(":").map(Number);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error("Invalid ATTENDANCE_START_TIME");
  }

  return hour * 60 + minute;
};

export const isLateArrival = (checkIn: string) => {
  return getLocalTimeMinutes(new Date(checkIn)) > getAttendanceStartMinutes();
};

export const getCurrentMonth = (date: Date = new Date()) => {
  return getLocalDate(date).slice(0, 7);
};

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: process.env.NEXT_PUBLIC_ATTENDANCE_TIME_ZONE || "Asia/Tehran",
  });
};
export const getTodayDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.NEXT_PUBLIC_ATTENDANCE_TIME_ZONE || "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};