import { useRef, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import DateComponent from "../DateComponent";
import { MessageProps, IData } from "./interface";
import controllerMessages from "./controllerMessage";
import FormMessage from "./FormMessage";
import DateComponentMini from "../DateComponentMini";
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
        <div className={styles.message__inner_top}>
          <span className={styles.message__inner_user}>{author}</span>
          <div className={styles.message__top_date}>
            {/* <DateComponentMini date={date} /> */}
            <DateComponent date={date} />
          </div>
        </div>

        {isEditMessage && (
          <FormMessage
            values={values}
            setValues={setValues}
            setIsEditMessage={setIsEditMessage}
            updateMessageById={updateMessageById}
            data={data}
          />
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
