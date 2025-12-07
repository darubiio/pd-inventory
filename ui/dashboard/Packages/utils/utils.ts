export const getDefaultDates = () => {
  const end = new Date();
  const start = new Date();

  start.setDate(start.getDate() - 30);
  const dateStart = start.toISOString().split("T")[0];
  const dateEnd = end.toISOString().split("T")[0];

  return { dateStart, dateEnd };
};
