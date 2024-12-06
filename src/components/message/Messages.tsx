import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { IMessage } from "../interface";
import Message from "./Message";
import chatStore from "../../mobx/chatStore";
import { observer } from "mobx-react-lite";
import useIntersectionObserver from "./useIntersectionObserver";
import useAutoScroll from "./useAutoScroll";
import { returnRef } from "./utilMessage";
import styles from "./Messages.module.scss";
import useScrollLoadingMessage from "./useScrollLoadingMessage";
function areDifferentDays(prevDate: string, todayDate: string) {
  const prev = new Date(prevDate);
  const today = new Date(todayDate);

  // Порівнюємо тільки рік, місяць і день
  return (
    prev.getFullYear() !== today.getFullYear() ||
    prev.getMonth() !== today.getMonth() ||
    prev.getDate() !== today.getDate()
  );
}
const Messages: React.FC = () => {
  // console.log("RENDER MESSAGES");
  //Коли ми редагуємо повідомлення то не прокручувати
  const [blockLastUserRef, setBlockLastUserRef] = useState<boolean>(false);
  // const arrayLastUserRef = useRef<(HTMLLIElement | null)[]>([]);
  const lastUserRef = useRef<HTMLLIElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const isFirstRender = useRef<number>(-1);
  const isEndMapRender = useRef<boolean>(false);
  const lastElement = useRef<boolean>(false);

  const prevDate = useRef<string>("");

  //Перший елемент з якого починаються непереглянуті повідомлення
  let startLastUserRef: boolean = false;
  const lengthState: number | undefined = chatStore?.state?.length;
  const name: string = chatStore.params.name;
  const isMyMessage: boolean =
    chatStore.params.name === chatStore.state.at(-1)?.author;
  isFirstRender.current++;

  if (isFirstRender.current === 0) {
    // console.log(chatStore.arrayLastUserRef);
    lastUserRef.current = null;
    chatStore.setArrayLastUserRef([]);
  }
  // console.log("CCCCCCCCCCCC", chatStore.arrayLastUserRef);
  const newState = chatStore.state.map((e) => e.id);
  console.log("SSSSSSS", newState);

  const { subscribe } = useIntersectionObserver();
  //Автопідгрузка при скролі догори
  useScrollLoadingMessage(listRef, lastUserRef);

  //Автопрокручування до низу
  useAutoScroll(lastUserRef);

  const prevReturnRef = useCallback(
    (ref: HTMLLIElement | null) => {
      returnRef(ref, lastElement, lastUserRef, subscribe);
    },
    [isMyMessage, lastUserRef, subscribe, lastElement.current]
  );

  useEffect(() => {
    // chatStore.setLoadingPrevMessagesScroll(false);
    chatStore.setLoadingMessagesStartId(null);
  }, [
    isEndMapRender.current,
    chatStore.setLoadingMessagesStartId,
    // chatStore.setLoadingPrevMessagesScroll,
  ]);

  return (
    <ul key="messages" ref={listRef} className={styles.messageList}>
      {lengthState > 0 &&
        chatStore.state.map((data: IMessage, i: number) => {
          if (!data) return null;
          const { author, message, id, date } = data;

          const isPrevDey = areDifferentDays(prevDate.current, date);
          // console.log(isPrevDey, prevDate.current, date); // Виведе: true

          prevDate.current = date;

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

          //Якщо підгрузилися нові непрочитанні повідомлення також при старті
          if (chatStore.isLoadingMessagesStartId) {
            if (chatStore.isLoadingMessagesStartId < data.id) {
              startLastUserRef = true;
            }
            if (i === lengthState - 1) {
              lastElement.current = true;
              startLastUserRef = true;
            }
          }

          //Якщо додалося нове одне повідомлення
          if (chatStore.isLoadingMessage) {
            if (i === lengthState - 1) {
              // console.log("BBBBBBBBBBB");
              startLastUserRef = true;
            }
          }

          if (chatStore.isLoadingPrevNextMessages) {
            if (i === lengthState - 1) {
              // console.log("BBBBBBBBBBB");
              startLastUserRef = true;
            }
          }
          
          // if (chatStore.isLoadingNextMessagesScroll) {
          //   if (i === lengthState - 1) {
          //     lastElement.current = true;
          //     // console.log("BBBBBBBBBBB");
          //     startLastUserRef = true;
          //   }
          // }

          if (i === lengthState - 1) {
            isEndMapRender.current = !isEndMapRender.current;
          }

          return (
            <Message
              key={id}
              returnRef={prevReturnRef}
              startLastUserRef={startLastUserRef}
              MyClassName={MyClassName}
              author={author}
              message={message}
              setBlockLastUserRef={setBlockLastUserRef}
              id={id}
              itsMe={itsMe}
              date={date}
              isPrevDey={isPrevDey}
            />
          );
        })}
    </ul>
  );
};

export default memo(observer(Messages));
