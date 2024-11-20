import { ReactHTMLElement, useRef, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import DateComponent from "../DateComponent";
import { MessageProps, IData } from "./interface";
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
  const [values, setValues] = useState<string>("");
  const [data, setData] = useState<IData>({ dataIdStr: "", dataMessage: "" });

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
        )}

        {!isEditMessage && (
          <div data-id={id} ref={divRef} className={styles.message__text}>
            {message}
            {itsMe && (
              <div className={styles.message__text_buttons}>
                <AiTwotoneDelete
                  onClick={() =>
                    controllerMessages.handleDeleteMessage(
                      divRef,
                      deleteMessageById,
                      setBlockLastUserRef
                    )
                  }
                />
                <MdOutlineModeEdit
                  onClick={() =>
                    controllerMessages.handleEditMessage(
                      divRef,
                      setData,
                      setValues,
                      setIsEditMessage,
                      setBlockLastUserRef
                    )
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
