import { useCallback, useEffect, useRef } from "react";
import chatStore from "../../mobx/chatStore";
import { sendLastViewMessagesServer } from "../socket/setDataSocket";
import throttle from "lodash/throttle";

const useIntersectionObserver = (isLastAddElementRef: any) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const processedElements = useRef(new Set<Element>());

  // console.log("RENDER useIntersectionObserver");

  useEffect(() => {
    if (observerRef.current && chatStore.arrayLastUserRef.length > 0) {
      chatStore.arrayLastUserRef.forEach((ref) => {
        subscribe(ref);
        // console.log("subscribe ----- ", observerRef.current, ref); //==null
      });
      isLastAddElementRef.current = false;
      chatStore.setArrayLastUserRef([]);
    }
  }, [observerRef.current, isLastAddElementRef.current]);

  const handleScrollThrottle = throttle((idNumber) => {
    chatStore.setLastNumberViewMessages(idNumber);
    // console.log(chatStore.dataMessagesId?.viewMessageId, idNumber);

    if (
      chatStore.dataMessagesId &&
      chatStore.dataMessagesId.viewMessageId < idNumber
    ) {
      sendLastViewMessagesServer({
        user: chatStore.params.name,
        room: chatStore.params.room,
        id: idNumber,
      });

      chatStore.setDataMessagesId({
        ...chatStore.dataMessagesId,
        viewMessageId: idNumber,
      });
    }
  }, 550);

  // Ваші дії при прокрутці }, 200); // Виконується не частіше, ніж раз на 200 мілісекунд

  const subscribe = useCallback(
    (nextElement: Element | null | undefined) => {
      if (nextElement) {
        observerRef.current?.observe(nextElement);
        processedElements.current.add(nextElement);
        // console.log("Subscribing to element:", nextElement);
        // console.log("ADD-----------", processedElements.current);
      }
    },
    [observerRef.current]
  );

  // Функція для відписки від спостереження за конкретним елементом
  const unsubscribeElement = useCallback((element: Element) => {
    if (element && observerRef.current) {
      // console.log("Unsubscribing from element:", element);
      observerRef.current.unobserve(element);
      processedElements.current.delete(element); // Видаляємо елемент з оброблених
    }
  }, []);

  const unsubscribeElements = useCallback(() => {
    processedElements.current.forEach((value) => {
      if (value instanceof HTMLLIElement) {
        // Перевірка типу елемента
        // console.log("Processing:", value);
        unsubscribeElement(value);
        processedElements.current.delete(value); // Видалення елемента
        // console.log("Set after deletion:", processedElements.current);
      } else {
        console.warn("Skipping element, not an HTMLLIElement:", value);
      }
    });
  }, [unsubscribeElement]);

  chatStore.setUnsubscribeElements(unsubscribeElements);

  // Виклик функції для відписки від конкретного елемента
  // unsubscribeElement(nextElement); // Замініть `nextElement` на ваш конкретний елемент

  const unsubscribe = () => {
    if (observerRef.current) observerRef.current.disconnect();
  };

  //Слідкування за новими повідомленнями які при перегляді будуть появлятися в зоні видимості
  useEffect(() => {
    // unsubscribe();
    //Створення нового Intersection Observer:
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // console.log(entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (processedElements.current.has(entry.target)) {
              const idString: string | null =
                entry.target.getAttribute("data-id");
              if (idString) {
                const idNumber: number = parseInt(idString);
                idNumber && handleScrollThrottle(idNumber);
                unsubscribeElement(entry.target);
                processedElements.current.delete(entry.target);
              }
            }
          }
        });
      },
      { threshold: 1.0 }
    );

    //Очищення обсерверу при розмонтаженні компонента:
    return () => unsubscribe();
  }, []);

  // console.log(
  //   "444444444444444444444444444444444444444------------------",
  //   observerRef.current
  // );

  return {};
};

export default useIntersectionObserver;
