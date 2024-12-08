import { useEffect } from "react";
import chatStore from "../../mobx/chatStore";

import infoStore from "../../mobx/infoStore";

const useAutoScroll = (
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>
) => {
  useEffect(() => {
    if (chatStore.isLoadingMessagesStartId && chatStore.dataMessagesId) {
      //якщо  всі повідомлення переглянуті
      // if (
      //   chatStore.dataMessagesId.viewMessageId ===
      //   chatStore.dataMessagesId.lastMessageId
      // ) {
      lastUserRef.current?.scrollIntoView();

      // } else {
      //   //якщо не всі повідомлення переглянуті

      // }
    }

    if (chatStore.isLoadingPrevNextMessages) {
      lastUserRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    } else if (!chatStore.isLoadingNextMessagesScroll) {
      // lastUserRef.current?.scrollIntoView(false);
      chatStore.setLoadingNextMessagesScroll(false);
    }
    lastUserRef.current = null;
    infoStore.setIdActive(null);
  }, [
    lastUserRef.current,
    chatStore.isLoadingNextMessagesScroll,
    chatStore.isLoadingPrevNextMessages,
    chatStore.isLoadingMessagesStartId,
  ]);
  return {};
};

export default useAutoScroll;
