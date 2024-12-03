import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { IMessage } from "../interface";
import Message from "./Message";
import chatStore from "../../mobx/chatStore";
import { observer } from "mobx-react-lite";
import { getLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";
import useIntersectionObserver from "./useIntersectionObserver";
import useAutoScroll from "./useAutoScroll";
import { returnRef } from "./utilMessage";
import styles from "./Messages.module.scss";
import useScrollLoadingMessage from "./useScrollLoadingMessage";

const Messages: React.FC = () => {
  console.log("RENDER MESSAGES");
  //Коли ми редагуємо повідомлення то не прокручувати
  const [blockLastUserRef, setBlockLastUserRef] = useState<boolean>(false);
  const arrayLastUserRef = useRef<(HTMLLIElement | null)[]>([]);
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

  // if (isFirstRender.current === 0) {
  lastUserRef.current = null;
  arrayLastUserRef.current = [];
  // }
  console.log("SSSSSSS", arrayLastUserRef);
  const newState = chatStore.state.map((e) => e.id);
  console.log("SSSSSSS", newState);

  // let lastMessagesId: number | undefined = getLastIdMessageViewLocalStorage();
  const lastMessagesId: number =
    isFirstRender.current === 0
      ? chatStore.state[0].id
      : chatStore.lastNumberViewMessages;
  console.log("lastMessagesId", lastMessagesId);
  // //Якщо останнього переглянутого елемента нема то переходимо до першого елемента
  // if (!lastMessagesId) {
  //   lastMessagesId = chatStore.state[0].id;
  // }

  // //Якщо lastMessagesId менший за першие повідомлення то ставимо перше повідомлення на яке треба переходити
  // if (lastMessagesId < chatStore.state[0].id) {
  //   lastMessagesId = chatStore.state[0].id;
  // }

  const { subscribe } = useIntersectionObserver(
    arrayLastUserRef,
    lastUserRef,
    isFirstRender
  );
  //Автопідгрузка при скролі догори
  useScrollLoadingMessage(listRef);

  //Автопрокручування до низу
  useAutoScroll(blockLastUserRef, lastUserRef);

  const prevReturnRef = useCallback(
    (ref: HTMLLIElement | null) => {
      returnRef(
        ref,
        startLastUserRef,
        isMyMessage,
        arrayLastUserRef,
        lastUserRef,
        subscribe
      );
    },
    [startLastUserRef, isMyMessage, arrayLastUserRef, lastUserRef, subscribe]
  );

  useEffect(() => {
    console.log("isFirstRender{{{{{{{{{{{{{{{");
    chatStore.setLoadingAddMessagesSecond(false);
    // chatStore.setLoadingPrevMessagesLoading(false);
    // chatStore.setLoadingNextMessagesLoading(false);
  }, [isEndMapRender.current]);
  // console.log("-----------------------", arrayLastUserRef.current);

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

          if (
            isFirstRender.current === 0 ||
            chatStore.isLoadingNextMessagesLoading
          ) {
            // if (!chatStore.isLoadingAddMessagesSecond) {

            if (lastMessagesId === id) {
              //останнє повідомлення
              console.log("DDDDDDDDD");
              startLastUserRef = true;
            }
          } else {
            //Якщо перший рендерр і не мої повідомлення
            if (!chatStore.isLoadingAddMessagesSecond) {
              // Якщо прилетіло нове повідомлення то блокуємо перепис масиву рефів
              if (!isMyMessage) {
                if (lastMessagesId === id) {
                  // console.log("AAAAAAAAAAA");
                  console.log(lastMessagesId, id);
                  startLastUserRef = true;
                }
              } else if (isMyMessage) {
                //Якщо я пишу і то мої повідомлення
                if (i === lengthState - 1) {
                  // console.log("BBBBBBBBBBB");
                  startLastUserRef = true;
                }
              }
            } else {
              //Коли приходить нове повідомлення то його добавляємо в масив arrayLastUserRef
              if (i === lengthState - 1) {
                //останнє повідомлення
                // console.log("DDDDDDDDD");
                startLastUserRef = true;
              }
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

// if (isFirstRender.current === 0 || chatStore.isLoadingAddMessagesSecond && isMyMessage) {
//   if (i === chatStore.state.length - 1) {
//     startLastUserRef = true;
//   }
// }else{
//   if (lastMessagesId === id) {
//     console.log("AAAAAAAAAAA");
//     console.log(lastMessagesId, id);
//     startLastUserRef = true;
//   }
// }
