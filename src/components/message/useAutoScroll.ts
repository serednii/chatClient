import { useEffect } from "react";

import chatStore from "../../mobx/chatStore";
import infoStore from "../../mobx/infoStore";

const useAutoScroll = (
  blockLastUserRef: boolean,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>
) => {
  useEffect(() => {
    if (!blockLastUserRef) {
      lastUserRef.current?.scrollIntoView(false);
    } else {
      lastUserRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    lastUserRef.current = null;
    infoStore.setIdActive(null);
  }, [
    // chatStore.state,
    blockLastUserRef,
    lastUserRef.current,
  ]);
  return {};
};

export default useAutoScroll;
