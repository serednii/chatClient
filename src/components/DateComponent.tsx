import React from "react";

interface DateComponentProps {
  date: string | undefined;
}

const DateComponent: React.FC<DateComponentProps> = ({ date }) => {
  if (!date) {
    return <span>----</span>;
  }

  const now = new Date();
  const givenDate = new Date(date);

  // Перевірка, чи дата сьогоднішня
  const isToday = now.toDateString() === givenDate.toDateString();

  // Перевірка, чи дата вчорашня
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === givenDate.toDateString();

  let formattedDate: string;

  if (isToday) {
    // Формат "03:41 PM"
    formattedDate = givenDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else if (isYesterday) {
    // Повертає "Yesterday"
    formattedDate = "Yesterday";
  } else {
    // Формат "YYYY.MM.DD"
    const year = givenDate.getFullYear();
    const month = String(givenDate.getMonth() + 1).padStart(2, "0"); // Додаємо 0, якщо місяць < 10
    const day = String(givenDate.getDate()).padStart(2, "0"); // Додаємо 0, якщо день < 10
    formattedDate = `${year}.${month}.${day}`;
  }

  return <span>{formattedDate}</span>;
};

export default DateComponent;
