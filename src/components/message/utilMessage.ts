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
  // console.log("CCCCCCCCCCCCCCCCCC", ref, lastUserRef.current);
  if (ref) {
    //Коли добавляємо по одному повідомленню
    if (chatStore.isLoadingAddMessagesFirst) {
      chatStore.setLoadingAddMessagesFirst(false);
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
    } else {
      if (lastElement.current) {
        //переходимо на останнє повідомлення
        lastUserRef.current = ref;
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLL", { ...lastUserRef });
        infoStore.setIdActive(ref);
        lastElement.current = false;
      } else {
        // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
        subscribe(
          ref
          // chatStore.arrayLastUserRef[chatStore.arrayLastUserRef.length - 1]
        );
      }
    }
  }
};

export { returnRef };
