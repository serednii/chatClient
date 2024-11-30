import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { IMessage } from "../interface";
import Message from "./Message";
import chatStore from "../../mobx/chatStore";
import styles from "./Messages.module.scss";
import { observer } from "mobx-react-lite";
import { sendLastMessagesServer } from "../socket/setDataSocket";
interface ILastMessages {
  room: string;
  startID: number;
  limit: number;
}
const Messages: React.FC = () => {
  const [blockLastUserRef, setBlockLastUserRef] = useState<boolean>(false);
  const lastUserRef = useRef<HTMLLIElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const name = chatStore.params.name;
  const isRef = useRef<any | null>(null);

  console.log(chatStore.isLoadingPrevMessages);

  const handleScroll = useCallback(() => {
    console.log(chatStore.isLoadingPrevMessages);

    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (
        scrollTop <= clientHeight * 0.25 &&
        !chatStore.isLoadingPrevMessages
      ) {
        chatStore.setLoadingPrevMessages();
        // room, startID, limit
        sendLastMessagesServer({
          room: chatStore.params.room,
          startID: chatStore.state[0].id,
          limit: 30,
        });
        console.log(
          "Scrolled to top 25% of the list. Fetching more messages..."
        );
        // Додаємо логіку для завантаження нових повідомлень
      }
    }
  }, [chatStore.isLoadingPrevMessages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.addEventListener("scroll", handleScroll);
      return () => listRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    console.log("scrollIntoView", chatStore.isLoadingPrevMessages);
    if (!chatStore.isLoadingPrevMessages) {
      if (!blockLastUserRef) {
        lastUserRef.current?.scrollIntoView(); // Прокрутка вниз
      } else {
        lastUserRef.current?.scrollIntoView({ behavior: "smooth" }); // Плавна прокрутка вниз
      }
    } else {
      chatStore.resetLoadingPrevMessages();
    }
  }, [chatStore.state]);

  isRef.current = chatStore.state;

  return (
    <ul key="messages" ref={listRef} className={styles.messageList}>
      {chatStore.state.length > 0 &&
        chatStore.state.map((data: IMessage, i: number) => {
          if (!data) return null;
          const { author, message, id, date } = data;
          if (
            typeof name !== "string" ||
            typeof author !== "string" ||
            typeof message !== "string" ||
            typeof date !== "string"
          ) {
            return null;
          }

          const itsMe =
            author.trim().toLowerCase() === name.trim().toLowerCase();
          const itsAdmin = author.trim().toLowerCase() === "admin";

          let MyClassName = itsMe ? styles.me : styles.user;
          MyClassName = itsAdmin ? styles.admin : MyClassName;

          return (
            <Message
              key={id}
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
            />
          );
        })}
    </ul>
  );
};

export default memo(observer(Messages));
