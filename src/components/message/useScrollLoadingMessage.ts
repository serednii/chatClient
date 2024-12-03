import { useCallback, useEffect, useRef } from "react";
import chatStore from "../../mobx/chatStore";
import infoStore from "../../mobx/infoStore";
import { IMessage } from "../interface";
import {
  sendNextMessagesServer,
  sendPrevMessagesServer,
} from "../socket/setDataSocket";

function getNextUserId(state: IMessage[]): number | undefined {
  console.log("getNextUserId");
  const lastElement: IMessage | undefined = state.pop();
  if (lastElement?.author === "Admin") {
    return getNextUserId(state);
  } else {
    return lastElement?.id;
  }
}

const useScrollLoadingMessage = (
  listRef: React.MutableRefObject<HTMLUListElement | null>,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>
) => {
  const prevScrollTop = useRef<number>(0); // Зберігаємо попереднє значення scrollTop
  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = listRef.current;
      // console.log(
      //   "EEEEEEEEEEEEE",
      //   parseInt(scrollTop.toString()),
      //   parseInt(prevScrollTop.current.toString()),
      //   scrollTop + clientHeight,
      //   scrollHeight * 0.9,
      //   scrollHeight * 0.25,
      //   scrollHeight,
      //   clientHeight,
      //   // chatStore.isLoadingPrevMessagesLoading,
      //   chatStore.isLoadingNextMessagesLoading
      // );
      //Автопідгрузка при скролі догори
      if (
        scrollTop < prevScrollTop.current &&
        scrollTop <= scrollHeight * 0.1 &&
        !chatStore.isLoadingPrevMessagesLoading
      ) {
        // Якщо прокручуємо вгору і досягли верхньої чверті екрана
        // chatStore.setLoadingPrevMessages();
        console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
        chatStore.setLoadingPrevMessagesLoading(true);

        sendPrevMessagesServer({
          room: chatStore.params.room,
          startID: chatStore.state[0].id,
          limit: 30,
        });
        infoStore.setUp(true);
        // infoStore.setIdActive(null);
        // lastUserRef.current = null;
        // chatStore.setActiveRef(null);
        console.log("EEEEEEEEEEEEE", chatStore.isLoadingPrevMessagesLoading);
        console.log(
          "Scrolled to top 25% of the list. Fetching more messages..."
        );
      }
      //Автопідгрузка при скролі в низ
      if (
        scrollTop > prevScrollTop.current &&
        scrollTop + clientHeight >= scrollHeight * 0.95 &&
        !chatStore.isLoadingNextMessagesLoading
      ) {
        // Якщо прокручуємо вгору і досягли верхньої чверті екрана

        console.log(
          "KKKKKKKKKKKKKKKKKKKKKKKKKKK************************************************"
        );
        chatStore.setLoadingNextMessagesLoading(true);

        const nextId: number | undefined = getNextUserId([...chatStore.state]);
        // console.log("UUUUUUUUUUUUUU", nextId);
        nextId &&
          sendNextMessagesServer({
            room: chatStore.params.room,
            startID: nextId,
            limit: 30,
          });
        infoStore.setDown(true);

        console.log("EEEEEEEEEEEEE", chatStore.isLoadingNextMessagesLoading);
        console.log(
          "Scrolled to top 25% of the list. Fetching more messages..."
        );
      }
      prevScrollTop.current = scrollTop; // Оновлюємо значення scrollTop
    }
  }, [
    chatStore.isLoadingPrevMessagesLoading,
    chatStore.isLoadingNextMessagesLoading,
    listRef.current,
    chatStore.isBlocked,
    chatStore.activeRef,
    chatStore.setLoadingPrevMessagesLoading,
    chatStore.setLoadingNextMessagesLoading,
  ]);

  //Автопідгрузка при скролі
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
  return {};
};

export default useScrollLoadingMessage;
