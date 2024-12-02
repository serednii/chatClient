import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { IMessage } from "../interface";
import Message from "./Message";
import chatStore from "../../mobx/chatStore";
import { observer } from "mobx-react-lite";
import { sendLastMessagesServer } from "../socket/setDataSocket";
import {
  addLastIdMessageViewLocalStorage,
  getLastIdMessageViewLocalStorage,
} from "../../localStorage/localStorage";
import useIntersectionObserver from "./useIntersectionObserver";
import { runInAction } from "mobx";
import useAutoScroll from "./useAutoScroll";
import { returnRef } from "./utilMessage";
import styles from "./Messages.module.scss";

const Messages: React.FC = () => {
  //Коли ми редагуємо повідомлення то не прокручувати
  const [blockLastUserRef, setBlockLastUserRef] = useState<boolean>(false);
  const arrayLastUserRef = useRef<(HTMLLIElement | null)[]>([]);
  const lastUserRef = useRef<HTMLLIElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const isFirstRender = useRef<number>(-1);
  const prevScrollTop = useRef<number>(0); // Зберігаємо попереднє значення scrollTop

  //Перший елемент з якого починаються непереглянуті повідомлення
  let startLastUserRef: boolean = false;
  const isEndMapRender = useRef<boolean>(false);
  const { subscribe } = useIntersectionObserver(
    arrayLastUserRef,
    lastUserRef,
    isFirstRender
  );
  const lengthState: number | undefined = chatStore?.state?.length;
  const isMyMessage: boolean =
    chatStore.params.name === chatStore.state.at(-1)?.author;
  console.log("RENDER MESSAGES");
  // console.log(chatStore.params.name, chatStore.state.at(-1)?.author);
  // console.log(
  //   typeof chatStore.params.name,
  //   typeof chatStore.state.at(-1)?.author
  // );

  // console.log(chatStore.params.name === chatStore.state.at(-1)?.author);

  const name = chatStore.params.name;
  isFirstRender.current++;

  if (isFirstRender.current === 0) {
    lastUserRef.current = null;
    arrayLastUserRef.current = [];
  }

  // console.log(chatStore.state);
  const newState = chatStore.state.map((e) => e.id);

  let lastMessagesId: number | undefined = getLastIdMessageViewLocalStorage();
  //Якщо останнього переглянутого елемента нема то переходимо до першого елемента
  if (!lastMessagesId) {
    lastMessagesId = chatStore.state[0].id;
  }

  if (lastMessagesId < chatStore.state[0].id) {
    lastMessagesId = chatStore.state[0].id;
  }
  console.log("lastMessagesId", lastMessagesId);
  //************************************************************************************

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, clientHeight } = listRef.current;
      // console.log(
      //   "EEEEEEEEEEEEE",
      //   parseInt(scrollTop.toString()),
      //   clientHeight,
      //   parseInt(prevScrollTop.current.toString()),
      //   chatStore.isLoadingPrevMessagesLoading
      // );

      if (
        scrollTop < prevScrollTop.current &&
        scrollTop <= clientHeight * 0.25 &&
        !chatStore.isLoadingPrevMessagesLoading
      ) {
        // Якщо прокручуємо вгору і досягли верхньої чверті екрана
        // chatStore.setLoadingPrevMessages();
        console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
        chatStore.setLoadingPrevMessagesLoading(true);

        sendLastMessagesServer({
          room: chatStore.params.room,
          startID: chatStore.state[0].id,
          limit: 30,
        });
        console.log("EEEEEEEEEEEEE", chatStore.isLoadingPrevMessagesLoading);
        // console.log(
        // "Scrolled to top 25% of the list. Fetching more messages..."
        // );
      }
      prevScrollTop.current = scrollTop; // Оновлюємо значення scrollTop
    }
  }, [
    chatStore.isLoadingPrevMessagesLoading,
    listRef.current,
    chatStore.setLoadingPrevMessagesLoading,
  ]);
  //************************************************************************************

  //Автопідгрузка при скролі догори
  useEffect(() => {
    console.log("UUUUUUUUUUUUUU");
    const idTimeOut = setTimeout(() => {
      if (listRef.current) {
        console.log("FFFFFFFFFFFFFFFFFF", listRef.current);
        listRef.current.addEventListener("scroll", handleScroll);
      }
    }, 500);
    return () => {
      console.log("SSSSSSSSSSSSSSSSSSSS");
      clearTimeout(idTimeOut);
      listRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, listRef.current]);

  //************************************************************************************

  // //добавляємо еолементи які ще непередивлялися
  // const returnRef = useCallback(
  //   (ref: HTMLLIElement | null): void => {
  //     console.log("CCCCCCCCCCCCCCCCCC", ref, lastUserRef.current);
  //     if (!lastUserRef.current) {
  //       console.log("KKKKKKKKKKKKKKLKKK", ref);

  //       //Перший елемент записуємо в реф для переходу
  //       lastUserRef.current = ref;
  //       startLastUserRef = false;
  //     } else {
  //       if (isMyMessage) {
  //         //моє повідомлення
  //         console.log("XXXXXXXXXXXXXXXX");
  //         if (arrayLastUserRef.current.length === 0) {
  //           console.log("LLLLLLLLLLLLLLLLL");

  //           //і всі повідомлення переглянуті
  //           lastUserRef.current = ref; //Добаляємо його в скрол
  //           console.log(lastUserRef.current);
  //           const idString: string | null =
  //             ref?.getAttribute("data-id") || null;
  //           if (idString) {
  //             const idNumber = parseInt(idString);
  //             console.log("12121212212", idNumber);
  //             idNumber && addLastIdMessageViewLocalStorage(idNumber);
  //           }
  //         } else {
  //           console.log("NNNNNNNNNNNNNNNNNNNN");

  //           arrayLastUserRef.current.push(ref); //добавляємо в масив для перегляду
  //           subscribe(
  //             arrayLastUserRef.current[arrayLastUserRef.current.length - 1]
  //           );
  //         }
  //       } else {
  //         console.log("ZZZZZZZZZZZZZZZZZZZZZZ");
  //         //чуже повідомлення то добавляємо в масив
  //         arrayLastUserRef.current.push(ref);
  //         subscribe(
  //           arrayLastUserRef.current[arrayLastUserRef.current.length - 1]
  //         );
  //       }
  //     }
  //   },
  //   [arrayLastUserRef.current, lastUserRef.current, subscribe, isMyMessage]
  // );
  //************************************************************************************

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
  }, [isEndMapRender.current]);
  console.log("-----------------------", arrayLastUserRef.current);
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

          if (isFirstRender.current === 0) {
            // if (!chatStore.isLoadingAddMessagesSecond) {
            if (lastMessagesId === id) {
              //останнє повідомлення
              // console.log("DDDDDDDDD");
              startLastUserRef = true;
            }
          } else {
            //Якщо перший рендерр і не мої повідомлення
            if (!chatStore.isLoadingAddMessagesSecond) {
              // Якщо прилетіло нове повідомлення то блокуємо перепис масиву рефів
              if (isFirstRender.current === 0 && !isMyMessage) {
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
