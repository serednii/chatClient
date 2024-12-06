import { useEffect } from "react";
import chatStore from "../../mobx/chatStore";

import infoStore from "../../mobx/infoStore";

const useAutoScroll = (
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>
) => {
  useEffect(() => {
    if (!chatStore.isLoadingNextMessagesScroll) {
      lastUserRef.current?.scrollIntoView(false);
    } else {
      lastUserRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    lastUserRef.current = null;
    infoStore.setIdActive(null);
  }, [lastUserRef.current, chatStore.isLoadingNextMessagesScroll]);
  return {};
};

export default useAutoScroll;
