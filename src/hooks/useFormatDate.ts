import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

const useFormatDate = () => {
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date || !dayjs(date).isValid()) return "-";

    return dayjs(date).format("DD MMMM YYYY");
  };

  const formatDateTime = (date: string | Date | null | undefined) => {
    if (!date || !dayjs(date).isValid()) return "-";

    return dayjs(date).format("DD MMMM YYYY, HH:mm");
  };

  const formatTime = (date: string | Date | null | undefined) => {
    if (!date || !dayjs(date).isValid()) return "-";

    return dayjs(date).format("HH:mm");
  };

  return {
    formatDate,
    formatDateTime,
    formatTime,
  };
};

export default useFormatDate;
