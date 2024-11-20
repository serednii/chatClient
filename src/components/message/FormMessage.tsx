import React, { useEffect, useRef } from "react";
import controllerMessages from "./controllerMessage";
import { IData } from "./interface";
import styles from "./Messages.module.scss";

interface IFormMessage {
  values: string;
  setValues: (value: string) => void;
  setIsEditMessage: (value: boolean) => void;
  updateMessageById: (id: number, message: string) => void;
  data: IData;
}

const FormMessage: React.FC<IFormMessage> = ({
  values,
  setValues,
  setIsEditMessage,
  updateMessageById,
  data,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Створюємо реф для textarea

  useEffect(() => {
    // Встановлюємо фокус на textarea після рендеру компонента
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []); // Пустий масив залежностей означає, що ефект виконається лише один раз після першого рендеру

  // Обробка натискання клавіші Enter та Esc
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Попереджаємо стандартну поведінку (наприклад, переход до нового рядка в textarea)
      const submitButton = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      if (submitButton) {
        submitButton.click(); // Симулюємо натискання на кнопку "submit"
      }
    }

    if (event.key === "Escape") {
      event.preventDefault(); // Попереджаємо стандартну поведінку
      setIsEditMessage(false); // Закриваємо форму або скасовуємо редагування
    }
  };

  return (
    <form
      className={styles.form__message}
      onKeyDown={handleKeyDown} // Додаємо обробник на клавіатурні події
    >
      <div className={styles.group__message}>
        <textarea
          ref={textareaRef} // Прив'язуємо реф до textarea
          value={values}
          onChange={(event) => setValues(event?.target?.value)}
          className={styles.input__message}
          name="message"
          placeholder="Enter your message"
          rows={4}
        />
      </div>

      <button
        onClick={(event) =>
          controllerMessages.handleClose(event, setIsEditMessage)
        }
        className={styles.button__close}
      >
        Close
      </button>

      <button
        type="submit"
        onClick={(event) =>
          controllerMessages.handleSendMessage(
            event,
            setIsEditMessage,
            updateMessageById,
            data,
            values
          )
        }
        className={styles.button__message}
      >
        Edit message
      </button>
    </form>
  );
};

export default FormMessage;
