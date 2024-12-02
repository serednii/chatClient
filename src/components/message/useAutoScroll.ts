import { useEffect } from "react";
import chatStore from "../../mobx/chatStore";

const useAutoScroll = (
  blockLastUserRef: boolean,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>
) => {
  useEffect(() => {
    if (!chatStore.isLoadingPrevMessagesScroll) {
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
  return {};
};

export default useAutoScroll;
