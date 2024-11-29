import React, { memo, useEffect, useRef, useState } from "react";
import { IMessage } from "../interface";
import Message from "./Message";
import chatStore from "../../mobx/chatStore";
import styles from "./Messages.module.scss";
import { observer } from "mobx-react-lite";

interface IMessageLocal {
  name: string;
  // deleteMessageById: (id: number) => void;
  // updateMessageById: (id: number, message: string) => void;
}

const Messages: React.FC<IMessageLocal> = ({ name }) => {
  const [blockLastUserRef, setBlockLastUserRef] = useState<boolean>(true);
  const lastUserRef = useRef<HTMLDivElement | null>(null); // Реф на последний элемент

  const isRef = useRef<any | null>(null);
  // const { state } = chatStore;
  useEffect(() => {
    if (lastUserRef.current && blockLastUserRef) {
      // lastUserRef.current.scrollIntoView({ behavior: "smooth" }); // Прокрутка вниз  { behavior: "smooth" } - плавная прокрутка
      lastUserRef.current.scrollIntoView(); // Прокрутка вниз  { behavior: "smooth" } - плавная прокрутка
    }

    // if (lastUserRef.current && blockLastUserRef) {
    //   lastUserRef.current.scrollIntoView({
    //     behavior: "smooth",
    //     block: "end", // Використовуємо параметр block для прокрутки до кінця елемента
    //     inline: "nearest",
    //   });
    //   window.scrollBy(0, +45); // Додаємо додатковий відступ
    // }
  }, [chatStore.state]); // Сработает каждый раз, когда изменится список usersName

  // if (lastUserRef.current && blockLastUserRef) {
  //   // Знаходимо відстань до елемента і додаємо відступ
  //   const elementPosition =
  //     lastUserRef.current.getBoundingClientRect().top + window.scrollY;
  //   const offsetPosition = elementPosition - 45; // Додаємо 45px відступ

  //   window.scrollTo({
  //     top: offsetPosition,
  //     behavior: "smooth",
  //   });
  // }

  console.log(chatStore.state === isRef.current);

  isRef.current = chatStore.state;
  return (
    <div key="messages">
      {chatStore.state.length > 0 &&
        chatStore.state.map((data: IMessage, i: number) => {
          // console.log(data.author);
          if (!data) {
            return;
          }

          const { author, message, id, date } = data;

          // Перевірка типів значень
          if (
            typeof name !== "string" ||
            typeof author !== "string" ||
            typeof message !== "string" ||
            typeof date !== "string"
          ) {
            return;
          }

          const itsMe =
            author.trim().toLowerCase() === name.trim().toLowerCase();

          const itsAdmin = author.trim().toLowerCase() === "admin";

          let MyClassName = itsMe ? styles.me : styles.user;

          MyClassName = itsAdmin ? styles.admin : MyClassName;
          return (
            <Message
              key={id} // Додаємо унікальний ключ
              lastUserRef={
                i === chatStore.state.length - 1 ? lastUserRef : null
              }
              MyClassName={MyClassName}
              author={author}
              message={message}
              setBlockLastUserRef={setBlockLastUserRef}
              id={id}
              itsMe={itsMe}
              date={date}
              // deleteMessageById={deleteMessageById}
              // updateMessageById={updateMessageById}
            />
          );
        })}
    </div>
  );
};

export default memo(observer(Messages));
