export const getDefaultDates = () => {
  const end = new Date();
  const start = new Date();

  start.setDate(start.getDate() - 40);
  const dateStart = start.toISOString().split("T")[0];
  const dateEnd = end.toISOString().split("T")[0];

  return { dateStart, dateEnd };
};
