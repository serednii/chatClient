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

const Messages: React.FC = () => {
  console.log("RENDER MESSAGES");
  //Коли ми редагуємо повідомлення то не прокручувати
  const [blockLastUserRef, setBlockLastUserRef] = useState<boolean>(false);
  // const arrayLastUserRef = useRef<(HTMLLIElement | null)[]>([]);
  const lastUserRef = useRef<HTMLLIElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const isFirstRender = useRef<number>(-1);
  const isEndMapRender = useRef<boolean>(false);

  //Перший елемент з якого починаються непереглянуті повідомлення
  let startLastUserRef: boolean = false;
  const lengthState: number | undefined = chatStore?.state?.length;
  const name: string = chatStore.params.name;
  const isMyMessage: boolean =
    chatStore.params.name === chatStore.state.at(-1)?.author;
  isFirstRender.current++;

  if (isFirstRender.current === 0) {
    console.log(chatStore.arrayLastUserRef);
    lastUserRef.current = null;
    chatStore.setArrayLastUserRef([]);
  }
  // console.log("CCCCCCCCCCCC", chatStore.arrayLastUserRef);
  const newState = chatStore.state.map((e) => e.id);
  // console.log("SSSSSSS", newState);

  const { subscribe } = useIntersectionObserver(
    // arrayLastUserRef,
    lastUserRef,
    isFirstRender
  );
  //Автопідгрузка при скролі догори
  useScrollLoadingMessage(listRef, lastUserRef);

  //Автопрокручування до низу
  useAutoScroll(blockLastUserRef, lastUserRef);

  const prevReturnRef = useCallback(
    (ref: HTMLLIElement | null) => {
      returnRef(ref, isFirstRender.current, lastUserRef, subscribe);
    },
    [isMyMessage, lastUserRef, subscribe, isFirstRender.current]
  );

  useEffect(() => {
    chatStore.setLoadingPrevMessagesScroll(false);
  }, [isEndMapRender.current, chatStore.setLoadingPrevMessagesScroll]);

  return (
    <ul key="messages" ref={listRef} className={styles.messageList}>
      {lengthState > 0 &&
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

          //Якщо підгрузилися нові непрочитанні повідомлення
          if (chatStore.isAddedMessageToLastUserRef) {
            if (chatStore.isAddedMessageToLastUserRef <= data.id)
              startLastUserRef = true;
          }

          //Якщо додалося нове повідомлення
          if (chatStore.isLoadingAddMessagesFirst) {
            if (i === lengthState - 1) {
              console.log("BBBBBBBBBBB");
              startLastUserRef = true;
            }
          }

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
            />
          );
        })}
    </ul>
  );
};

export default memo(observer(Messages));
