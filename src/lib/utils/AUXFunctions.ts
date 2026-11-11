export const getInitials = (name: string) => {
  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const formatDate = (date: string) => date.split("T")[0];

export const getMonthName = (month: number) => {
  return new Date(2000, month - 1).toLocaleString("en-US", {
    month: "long",
  });
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
