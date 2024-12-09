import { useEffect } from "react";
import chatStore from "../../mobx/chatStore";

import infoStore from "../../mobx/infoStore";

const useAutoScroll = (
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>
) => {
  useEffect(() => {
    // console.log("MMMMMMMMMMMMMMMMMMM-----------", chatStore.isLoadingMessage);

    if (chatStore.isLoadingMessagesStartId && chatStore.dataMessagesId) {
      // console.log("MMMMMMMMMMMMMMMMMMM---***************----");

      //якщо  всі повідомлення переглянуті
      // if (
      //   chatStore.dataMessagesId.viewMessageId ===
      //   chatStore.dataMessagesId.lastMessageId
      // ) {
      lastUserRef.current?.scrollIntoView();

      // } else {
      //   //якщо не всі повідомлення переглянуті

      // }
    } else if (chatStore.isLoadingPrevNextMessages) {
      // console.log("MMMMMMMMMMMMMMMMMMM-----//////////////////-");
      lastUserRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    if (!chatStore.isLoadingNextMessagesScroll) {
      // lastUserRef.current?.scrollIntoView(false);
      chatStore.setLoadingNextMessagesScroll(false);
    }

    if (chatStore.isLoadingMessage) {
      // console.log("MMMMMMMMMMMMMMMMMMM");
      chatStore.setLoadingMessage(false);
      lastUserRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    lastUserRef.current = null;
    infoStore.setIdActive(null);
  }, [
    lastUserRef.current,
    chatStore.isLoadingMessage,
    chatStore.isLoadingNextMessagesScroll,
    chatStore.isLoadingPrevNextMessages,
    chatStore.isLoadingMessagesStartId,
  ]);
  return {};
};

export default useAutoScroll;
