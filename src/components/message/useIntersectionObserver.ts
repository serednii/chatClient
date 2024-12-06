import { useCallback, useEffect, useRef } from "react";
import { addLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";
import chatStore from "../../mobx/chatStore";
import { sendLastViewMessagesServer } from "../socket/setDataSocket";
import throttle from "lodash/throttle";
import infoStore from "../../mobx/infoStore";

const useIntersectionObserver = (
  // arrayLastUserRef: React.MutableRefObject<(HTMLLIElement | null)[]>,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>,
  isFirstRender: React.MutableRefObject<number>
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleScrollThrottle = throttle((idNumber) => {
    // console.log("Scrolled:1111111111111111111111111111111111111111111111");
    chatStore.setLastNumberViewMessages(idNumber);

    console.log(chatStore.dataMessagesId?.viewMessageId, idNumber);

    if (
      chatStore.dataMessagesId &&
      chatStore.dataMessagesId.viewMessageId < idNumber
    ) {
      sendLastViewMessagesServer({
        user: chatStore.params.name,
        room: chatStore.params.room,
        id: idNumber,
      });
    }
    chatStore.dataMessagesId &&
      (chatStore.dataMessagesId.viewMessageId = idNumber);
  }, 550);

  // Ваші дії при прокрутці }, 200); // Виконується не частіше, ніж раз на 200 мілісекунд
  const subscribe = useCallback(
    (nextElement: HTMLLIElement | null) => {
      if (nextElement) {
        observerRef.current?.observe(nextElement);
      }
    },
    [observerRef]
  );

  const unsubscribe = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
  }, [observerRef]);

  //Слідкування за новими повідомленнями які при перегляді будуть появлятися в зоні видимості
  useEffect(() => {
    let nextElement = chatStore.deleteFirstElementArrayLastUserRef() || null;

    // console.log("-----------------------------", nextElement);
    //Очищення попереднього обсерверу:
    unsubscribe();
    //Створення нового Intersection Observer:
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idString: string | null =
              entry.target.getAttribute("data-id");
            if (idString) {
              const idNumber: number = parseInt(idString);
              // console.log("12121212212", idNumber);
              // idNumber && addLastIdMessageViewLocalStorage(idNumber);
              idNumber && handleScrollThrottle(idNumber);
              // infoStore.setIdActive(nextElement);
              // chatStore.setActiveRef(nextElement);
            }

            // Ваш виклик функції

            // unsubscribe();
            // nextElement =
            //   chatStore.deleteFirstElementArrayLastUserRef() || null;
            //   subscribe(nextElement);

            // if (isFirstRender.current > 0) {
            //   lastUserRef.current = nextElement;
            // }
            // console.log("arrayLastUserRef", arrayLastUserRef);
            // console.log("lastUserRef.current", lastUserRef.current);
          }
        });
      },
      { threshold: 1.0 }
    );
    //Додавання спостереження за елементом
    subscribe(nextElement);

    //Очищення обсерверу при розмонтаженні компонента:
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [subscribe, unsubscribe]);
  return { subscribe };
};

export default useIntersectionObserver;
