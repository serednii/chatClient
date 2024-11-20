import { useRef, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import DateComponent from "../DateComponent";
import { MessageProps } from "./interface";
import controllerMessages from "./controllerMessage";
import styles from "./Messages.module.scss";

const Message: React.FC<MessageProps> = ({
  author,
  message,
  lastUserRef,
  id,
  date,
  MyClassName,
  itsMe,
  deleteMessageById,
  setBlockLastUserRef,
  updateMessageById,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isEditMessage, setIsEditMessage] = useState(false);
  const [values, setValues] = useState("");
  const [data, setData] = useState<any>();

  // controllerMessages.handleChange(event, { setValues });

  const handleDeleteMessage = () => {
    if (divRef.current) {
      const dataIdStr = divRef.current.getAttribute("data-id");
      if (dataIdStr) {
        const dataId = parseInt(dataIdStr);
        /* eslint-disable no-restricted-globals */
        if (confirm("Ви впевнені, що хочете видалити повідомлення")) {
          deleteMessageById(dataId);
        }
      }
      /* eslint-enable no-restricted-globals */
    }
    setBlockLastUserRef(false);
    setTimeout(() => setBlockLastUserRef(true), 2050);
  };

  const handleEditMessage = () => {
    if (divRef.current) {
      const dataIdStr = divRef.current.getAttribute("data-id");
      const dataMessage = divRef.current.innerText;
      setData({
        dataIdStr,
        dataMessage,
      });
      setValues(dataMessage);
      setIsEditMessage(true);
      setBlockLastUserRef(false);
      setTimeout(() => setBlockLastUserRef(true), 2050);
    }
  };

  const handleClose = (event: any) => {
    event.preventDefault();
    setIsEditMessage(false);
  };

  const handleSendMessage = (event: any) => {
    event.preventDefault();
    if (data) {
      const dataId = parseInt(data?.dataIdStr);
      updateMessageById(dataId, values);
    }
    setTimeout(() => setIsEditMessage(false), 150);
  };

  return (
    <div
      key={id}
      ref={lastUserRef}
      className={`${styles.message} ${MyClassName}`}
    >
      <div className={styles.message__inner}>
        <span className={styles.user}>
          <span>{author}</span>
          <br />
          <DateComponent date={date} />
        </span>

        {/* <p className={styles.user}>{localDate.toString()}</p> */}

        {isEditMessage && (
          <form className={styles.form__message}>
            <div className={styles.group__message}>
              <textarea
                value={values}
                onChange={(event) => setValues(event?.target?.value)}
                className={styles.input__message} // Використовуйте той самий стиль або змініть його відповідно до дизайну
                name="message"
                placeholder="Enter your message"
                rows={4} // Додайте, якщо потрібно обмежити кількість рядків
              />
              {/* <textarea id="story" name="story"></textarea> */}
            </div>

            <button
              onClick={(event) => handleClose(event)}
              className={styles.button__close}
            >
              Close
            </button>

            <button
              type="submit"
              onClick={(event) => handleSendMessage(event)}
              className={styles.button__message}
            >
              Edit message
            </button>
          </form>
        )}

        {!isEditMessage && (
          <div data-id={id} ref={divRef} className={styles.message__text}>
            {message}
            {itsMe && (
              <div className={styles.message__text_buttons}>
                <AiTwotoneDelete onClick={handleDeleteMessage} />
                <MdOutlineModeEdit onClick={handleEditMessage} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
