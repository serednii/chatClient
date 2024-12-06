import { addLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";
import chatStore from "../../mobx/chatStore";
import infoStore from "../../mobx/infoStore";

//добавляємо еолементи які ще непередивлялися
const returnRef = (
  ref: HTMLLIElement | null,
  lastElement: React.MutableRefObject<boolean>,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>,
  subscribe: (nextElement: HTMLLIElement | null) => void
): void => {
  if (ref) {
    console.log("CCCCCCCCCCCCCCCCCC", ref);
    //Коли добавляємо по одному повідомленню
    if (chatStore.isLoadingMessage) {
      chatStore.setLoadingMessage(false);
      if (
        chatStore.state[chatStore.state.length - 1].author !==
        chatStore.params.name
      ) {
        // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
        subscribe(
          ref
          // chatStore.arrayLastUserRef[chatStore.arrayLastUserRef.length - 1]
        );
      } else {
        lastUserRef.current = ref;
        infoStore.setIdActive(ref);
      }
    } else if (chatStore.isLoadingMessagesStartId) {
      subscribe(ref);
      // chatStore.dataMessagesId?.viewMessageId || 1
      // let idMessage: number = parseInt(ref.getAttribute("data-id") || "");
      // if (idMessage && idMessage === chatStore.dataMessagesId?.viewMessageId) {
      //   lastUserRef.current = ref;
      // } else {
      //   // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
      //   subscribe(
      //     ref
      //     // chatStore.arrayLastUserRef[chatStore.arrayLastUserRef.length - 1]
      //   );
      // }
      // if (lastElement.current) {
      //   //переходимо на останнє повідомлення
      //   console.log("LLLLLLLLLLLLLLLLLLLLLLLL", { ...lastUserRef });
      //   infoStore.setIdActive(ref);
      //   // lastElement.current = false;
      // }
    } else if (chatStore.isLoadingPrevNextMessages) {
      lastUserRef.current = ref;
      subscribe(ref);
    }
  }
};

export { returnRef };
