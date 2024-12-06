import { useCallback, useEffect, useRef } from "react";
import { addLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";
import chatStore from "../../mobx/chatStore";
import { sendLastViewMessagesServer } from "../socket/setDataSocket";
import throttle from "lodash/throttle";
import infoStore from "../../mobx/infoStore";

const useIntersectionObserver = () =>
  // arrayLastUserRef: React.MutableRefObject<(HTMLLIElement | null)[]>,

  {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const processedElements = useRef(new Set<Element>());

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
    // const subscribe = useCallback(
    //   (nextElement: HTMLLIElement | null) => {
    //     if (nextElement) {
    //       observerRef.current?.observe(nextElement);
    //     }
    //   },
    //   [observerRef]
    // );

    const subscribe = useCallback(
      (nextElement: HTMLLIElement | null) => {
        if (nextElement) {
          // console.log("Subscribing to element:", nextElement);
          observerRef.current?.observe(nextElement);
          processedElements.current.add(nextElement);
          // console.log("ADD-----------", processedElements.current);
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
          console.log(processedElements.current);
          // console.log(entries);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (processedElements.current.has(entry.target)) {
                const idString: string | null =
                  entry.target.getAttribute("data-id");
                if (idString) {
                  const idNumber: number = parseInt(idString);
                  idNumber && handleScrollThrottle(idNumber);
                  processedElements.current.delete(entry.target);
                }
              }
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

// import { useCallback, useEffect, useRef } from "react";
// import throttle from "lodash/throttle";
// import { sendLastViewMessagesServer } from "../socket/setDataSocket";
// import chatStore from "../../mobx/chatStore";

// const useIntersectionObserver = () => {
//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const processedElements = useRef(new Set<Element>());

//   const handleScrollThrottle = throttle((idNumber) => {
//     console.log("handleScrollThrottle called with idNumber:", idNumber);
//     chatStore.setLastNumberViewMessages(idNumber);

//     if (
//       chatStore.dataMessagesId &&
//       chatStore.dataMessagesId.viewMessageId < idNumber
//     ) {
//       sendLastViewMessagesServer({
//         user: chatStore.params.name,
//         room: chatStore.params.room,
//         id: idNumber,
//       });
//     }
//     if (chatStore.dataMessagesId) {
//       chatStore.setDataMessagesId({
//         ...chatStore.dataMessagesId,
//         viewMessageId: idNumber,
//       });
//     }
//   }, 550);

//   const subscribe = useCallback(
//     (nextElement: HTMLLIElement | null) => {
//       if (nextElement && !processedElements.current.has(nextElement)) {
//         console.log("Subscribing to element:", nextElement);
//         observerRef.current?.observe(nextElement);
//         processedElements.current.add(nextElement);
//       }
//     },
//     [observerRef]
//   );

//   const unsubscribe = useCallback(() => {
//     if (observerRef.current) {
//       console.log("Unsubscribing from all elements");
//       processedElements.current.forEach((element) =>
//         observerRef.current!.unobserve(element)
//       );
//       processedElements.current.clear();
//     }
//   }, [observerRef]);

//   useEffect(() => {
//     let nextElement = chatStore.deleteFirstElementArrayLastUserRef() || null;
//     console.log("Next element to observe:", nextElement);

//     if (nextElement === null) {
//       console.log("No more elements to observe. Exiting useEffect.");
//       return;
//     }

//     unsubscribe();
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const idString = entry.target.getAttribute("data-id");
//             if (idString) {
//               const idNumber = parseInt(idString);
//               if (idNumber && !processedElements.current.has(entry.target)) {
//                 console.log("Element intersected:", entry.target);
//                 handleScrollThrottle(idNumber);
//                 processedElements.current.add(entry.target);
//               }
//             }
//           }
//         });
//       },
//       { threshold: 1.0 }
//     );

//     subscribe(nextElement);

//     return () => {
//       unsubscribe();
//     };
//   }, [subscribe, unsubscribe]);

//   return { subscribe };
// };

// export default useIntersectionObserver;

// import { useCallback, useEffect, useRef } from "react";
// import throttle from "lodash/throttle";
// import { sendLastViewMessagesServer } from "../socket/setDataSocket";
// import chatStore from "../../mobx/chatStore";

// const useIntersectionObserver = () => {
//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const processedElements = useRef(new Set<Element>());

//   const handleScrollThrottle = throttle((idNumber) => {
//     console.log("handleScrollThrottle called with idNumber:", idNumber);
//     chatStore.setLastNumberViewMessages(idNumber);

//     if (
//       chatStore.dataMessagesId &&
//       chatStore.dataMessagesId.viewMessageId < idNumber
//     ) {
//       sendLastViewMessagesServer({
//         user: chatStore.params.name,
//         room: chatStore.params.room,
//         id: idNumber,
//       });
//     }
//     if (chatStore.dataMessagesId) {
//       chatStore.setDataMessagesId({
//         ...chatStore.dataMessagesId,
//         viewMessageId: idNumber,
//       });
//     }
//   }, 550);

//   const subscribe = useCallback(
//     (nextElement: HTMLLIElement | null) => {
//       if (nextElement && !processedElements.current.has(nextElement)) {
//         console.log("Subscribing to element:", nextElement);
//         observerRef.current?.observe(nextElement);
//         processedElements.current.add(nextElement);
//       }
//     },
//     [observerRef]
//   );

//   const unsubscribe = useCallback(() => {
//     if (observerRef.current) {
//       console.log("Unsubscribing from all elements");
//       processedElements.current.forEach((element) =>
//         observerRef.current!.unobserve(element)
//       );
//       processedElements.current.clear();
//     }
//   }, [observerRef]);

//   useEffect(() => {
//     unsubscribe();
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const idString = entry.target.getAttribute("data-id");
//             if (idString) {
//               const idNumber = parseInt(idString);
//               if (idNumber && !processedElements.current.has(entry.target)) {
//                 console.log("Element intersected:", entry.target);
//                 handleScrollThrottle(idNumber);
//                 processedElements.current.add(entry.target);
//               }
//             }
//           }
//         });
//       },
//       { threshold: 1.0 }
//     );

//     return () => {
//       unsubscribe();
//     };
//   }, [subscribe, unsubscribe]);

//   return { subscribe };
// };

// export default useIntersectionObserver;
