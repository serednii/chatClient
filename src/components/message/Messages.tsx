import React, { useEffect, useRef, useState } from "react";
import { IState, IMessage } from "../interface";
import Message from "./Message";
import styles from "./Messages.module.scss";
interface IMessageLocal {
  state: IState;
  name: string;
  deleteMessageById: (id: number) => void;
  updateMessageById: (id: number, message: string) => void;
}

const Messages: React.FC<IMessageLocal> = ({
  state,
  name,
  deleteMessageById,
  updateMessageById,
}) => {
  const { messages } = state.message;
  const [blockLastUserRef, setBlockLastUserRef] = useState(true);
  const lastUserRef = useRef<HTMLDivElement | null>(null); // Реф на последний элемент
  // console.log("mesage", messages);
  // useEffect(() => {
  //   // Викликати setBlockLastUserRef(true) після завершення рендеру
  //   setBlockLastUserRef(true);
  // }, [messages]); // Залежність від messages
  useEffect(() => {
    if (lastUserRef.current && blockLastUserRef) {
      lastUserRef.current.scrollIntoView({ behavior: "smooth" }); // Прокрутка вниз  { behavior: "smooth" } - плавная прокрутка
    }
  }, [messages]); // Сработает каждый раз, когда изменится список usersName

  return (
    <div>
      {messages &&
        messages.map(({ author, message, id, date }: IMessage, i: number) => {
          const itsMe =
            author.trim().toLowerCase() === name.trim().toLowerCase();
          const itsAdmin = author.trim().toLowerCase() === "admin";
          let MyClassName = itsMe ? styles.me : styles.user;
          MyClassName = itsAdmin ? styles.admin : MyClassName;
          return (
            <Message
              lastUserRef={i === messages.length - 1 ? lastUserRef : null}
              MyClassName={MyClassName}
              author={author}
              message={message}
              setBlockLastUserRef={setBlockLastUserRef}
              id={id}
              itsMe={itsMe}
              date={date}
              deleteMessageById={deleteMessageById}
              updateMessageById={updateMessageById}
            />
          );
        })}
    </div>
  );
};

export default Messages;
