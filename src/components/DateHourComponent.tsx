import React from "react";
import styles from "./message/Messages.module.scss";

interface DateComponentProps {
  date: string;
}

const DateHourComponent: React.FC<DateComponentProps> = ({ date }) => {
  // Конвертуємо дату з UTC до місцевого часу
  const localDate = new Date(date).toLocaleString("uk-UA", {
    // year: "numeric",
    // month: "numeric",
    // day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  });

  return <span>{localDate}</span>;
};

export default DateHourComponent;
