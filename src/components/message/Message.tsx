import { memo, useRef, useState, useEffect } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import DateComponent from "../DateComponent";
import { IData } from "./interface";
import controllerMessages from "./controllerMessage";
import FormMessage from "./FormMessage";
import DateComponentMini from "../DateComponentMini";
import styles from "./Messages.module.scss";
import { observer } from "mobx-react-lite";
import { MutableRefObject } from "react";

interface MessageProps {
  id: number;
  // lastUserRef: MutableRefObject<HTMLLIElement | null> | null;
  startLastUserRef: boolean;
  MyClassName: string;
  author: string;
  message: string;
  date: string;
  itsMe: boolean;
  returnRef: (ref: HTMLLIElement | null) => void;
  setBlockLastUserRef: (value: boolean) => void;
}

const Message: React.FC<MessageProps> = ({
  author,
  message,
  startLastUserRef,
  id,
  date,
  MyClassName,
  itsMe,
  returnRef,
  setBlockLastUserRef,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const lastUserRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (startLastUserRef && lastUserRef.current) {
      // console.log("MMMMMMMMMMMMMMMMM", lastUserRef);
      returnRef(lastUserRef.current);
    }
  }, [startLastUserRef, lastUserRef, returnRef]);

  const [isEditMessage, setIsEditMessage] = useState(false);
  const [values, setValues] = useState<string>("");
  const [data, setData] = useState<IData>({ dataIdStr: "", dataMessage: "" });

  return (
    <li
      data-id={id}
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
            data={data}
          />
        )}

        {!isEditMessage && (
          <div data-id={id} ref={divRef} className={styles.message__text}>
            {message + " " + id}
            {itsMe && (
              <div className={styles.message__text_buttons}>
                <AiTwotoneDelete
                  onClick={() =>
                    controllerMessages.handleDeleteMessage(
                      divRef,
                      // deleteMessageById,
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
    </li>
  );
};

export default memo(observer(Message));
