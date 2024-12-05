import React from "react";
import styles from "./message/Messages.module.scss";

interface DateComponentProps {
  date: string;
}

const DateDayComponent: React.FC<DateComponentProps> = ({ date }) => {
  // Конвертуємо дату з UTC до місцевого часу
  const localDate = new Date(date).toLocaleString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  });

  return <span className={styles.message__top_date_mini}>{localDate}</span>;
};

export default DateDayComponent;
