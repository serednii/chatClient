import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { IMessage } from "../interface";
import Message from "./Message";
import chatStore from "../../mobx/chatStore";
import styles from "./Messages.module.scss";
import { observer } from "mobx-react-lite";
import { sendLastMessagesServer } from "../socket/setDataSocket";
import {
  addLastIdMessageViewLocalStorage,
  getLastIdMessageViewLocalStorage,
} from "../../localStorage/localStorage";
import useIntersectionObserver from "./useIntersectionObserver";
import { type } from "@testing-library/user-event/dist/type";

const Messages: React.FC = () => {
  //Коли ми редагуємо повідомлення то не прокручувати
  const [blockLastUserRef, setBlockLastUserRef] = useState<boolean>(false);
  // const arrayLastUserRef: (HTMLLIElement | null)[] = [];
  // let lastUserRef: HTMLLIElement | null = null;
  const arrayLastUserRef = useRef<(HTMLLIElement | null)[]>([]);
  const lastUserRef = useRef<HTMLLIElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const isFirstRender = useRef<number>(-1);
  //Перший елемент з якого починаються непереглянуті повідомлення
  let startLastUserRef: boolean = false;

  const { subscribe } = useIntersectionObserver(
    arrayLastUserRef,
    lastUserRef,
    isFirstRender
  );
  // const observerRef = useRef<IntersectionObserver | null>(null);

  const isMyMessage = chatStore.params.name === chatStore.state.at(-1)?.author;
  console.log("---------------------------------");
  console.log(chatStore.params.name, chatStore.state.at(-1)?.author);
  console.log(
    typeof chatStore.params.name,
    typeof chatStore.state.at(-1)?.author
  );

  console.log(chatStore.params.name === chatStore.state.at(-1)?.author);

  console.log("---------------------------------");

  const name = chatStore.params.name;
  isFirstRender.current++;

  if (isFirstRender.current === 0) {
    lastUserRef.current = null;
    arrayLastUserRef.current = [];
  }

  console.log(chatStore.state);
  const newState = chatStore.state.map((e) => e.id);

  let lastMessagesId = getLastIdMessageViewLocalStorage();
  //Якщо останнього переглянутого елемента нема то переходимо до першого елемента
  if (!lastMessagesId || lastMessagesId < chatStore.state[0].id) {
    lastMessagesId = chatStore.state[0].id;
  }

  const prevScrollTop = useRef<number>(0); // Зберігаємо попереднє значення scrollTop
  //************************************************************************************

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, clientHeight } = listRef.current;
      console.log(
        "EEEEEEEEEEEEE",
        parseInt(scrollTop.toString()),
        clientHeight,
        parseInt(prevScrollTop.current.toString()),
        chatStore.isLoadingPrevMessagesLoading
      );

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
        console.log(
          "Scrolled to top 25% of the list. Fetching more messages..."
        );
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

  //добавляємо еолементи які ще непередивлялися
  const returnRef = useCallback(
    (ref: HTMLLIElement | null): void => {
      console.log("CCCCCCCCCCCCCCCCCC", ref, lastUserRef.current);
      if (!lastUserRef.current) {
        console.log("KKKKKKKKKKKKKKLKKK", ref);

        //Перший елемент записуємо в реф для переходу
        lastUserRef.current = ref;
        startLastUserRef = false;
      } else {
        if (isMyMessage) {
          //моє повідомлення
          console.log("XXXXXXXXXXXXXXXX");
          if (arrayLastUserRef.current.length === 0) {
            console.log("LLLLLLLLLLLLLLLLL");

            //і всі повідомлення переглянуті
            lastUserRef.current = ref; //Добаляємо його в скрол
            console.log(lastUserRef.current);
            const idString: string | null =
              ref?.getAttribute("data-id") || null;
            if (idString) {
              const idNumber = parseInt(idString);
              console.log("12121212212", idNumber);
              idNumber && addLastIdMessageViewLocalStorage(idNumber);
            }
            // subscribe(ref);
          } else {
            console.log("NNNNNNNNNNNNNNNNNNNN");

            arrayLastUserRef.current.push(ref); //добавляємо в масив для перегляду
            // lastUserRef.current = arrayLastUserRef.current[0];
            subscribe(
              arrayLastUserRef.current[arrayLastUserRef.current.length - 1]
            );
          }
        } else {
          console.log("ZZZZZZZZZZZZZZZZZZZZZZ");
          //чуже повідомлення то добавляємо в масив
          arrayLastUserRef.current.push(ref);
          // lastUserRef.current = arrayLastUserRef.current[0];
          subscribe(
            arrayLastUserRef.current[arrayLastUserRef.current.length - 1]
          );
        }
      }
    },
    [arrayLastUserRef.current, lastUserRef.current, subscribe, isMyMessage]
    // [arrayLastUserRef, startLastUserRef.current]
  );
  //************************************************************************************

  console.log("arrayLastUserRef", arrayLastUserRef);
  //Автопрокручування до низу
  useEffect(() => {
    console.log("HHHHHHHHHHHHHH", lastUserRef.current);
    if (!chatStore.isLoadingPrevMessagesScroll) {
      // if (!chatStore.isLoadingPrevMessages && !chatStore.isLoadingAddMessages) {
      console.log("GGGGGGGGGGGGGGGGGG", lastUserRef.current);
      if (!blockLastUserRef) {
        lastUserRef.current?.scrollIntoView(false);
      } else {
        lastUserRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    } else {
      chatStore.setLoadingPrevMessagesScroll(false);
    }
  }, [
    chatStore.state,
    blockLastUserRef,
    lastUserRef.current,
    chatStore.isLoadingPrevMessagesScroll,
    chatStore.setLoadingPrevMessagesScroll,
  ]);
  //************************************************************************************

  console.log("isMyMessage", isMyMessage);
  console.log("newState", newState);
  console.log("startLastUserRef", startLastUserRef);
  console.log("lastMessagesId", lastMessagesId);
  console.log("isFirstRender", isFirstRender);
  setTimeout(() => {
    console.log("arrayLastUserRef", arrayLastUserRef);
  }, 1000);

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
          if (isFirstRender.current === 0) {
            if (i === chatStore.state.length - 1) {
              //останнє повідомлення
              console.log("DDDDDDDDD");
              startLastUserRef = true;
            }
          } else {
            //Якщо перший рендерр і не мої повідомлення
            if (!chatStore.isLoadingAddMessagesSecond) {
              // Якщо прилетіло нове повідомлення то блокуємо перепис масиву рефів
              if (isFirstRender.current === 0 && !isMyMessage) {
                if (lastMessagesId === id) {
                  console.log("AAAAAAAAAAA");
                  console.log(lastMessagesId, id);
                  startLastUserRef = true;
                }
              } else if (isMyMessage) {
                //Якщо я пишу і то мої повідомлення
                if (i === chatStore.state.length - 1) {
                  console.log("BBBBBBBBBBB");
                  startLastUserRef = true;
                }
              }
            } else {
              //Коли приходить нове повідомлення то його добавляємо в масив arrayLastUserRef
              if (i === chatStore.state.length - 1) {
                //останнє повідомлення
                console.log("DDDDDDDDD");
                startLastUserRef = true;
              }
            }
          }

          if (i === chatStore.state.length - 1) {
            chatStore.setLoadingAddMessagesSecond(false);
          }

          return (
            <Message
              key={id}
              returnRef={returnRef}
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
