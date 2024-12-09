import { addLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";
import chatStore from "../../mobx/chatStore";
import infoStore from "../../mobx/infoStore";

//добавляємо еолементи які ще непередивлялися
const returnRef = (
  ref: HTMLLIElement | null,
  lastElement: React.MutableRefObject<boolean>,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>
  // subscribe: any
): void => {
  if (ref) {
    // console.log("CCCCCCCCCCCCCCCCCC", ref);

    //Коли добавляємо по одному повідомленню
    if (chatStore.isLoadingMessage) {
      const author = chatStore.state[chatStore.state.length - 1].author;
      if (author === "Admin") {
        // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
        lastUserRef.current = ref;
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLL", ref);
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLL", chatStore.arrayLastUserRef);
        // subscribe(ref);
      } else if (author !== chatStore.params.name) {
        // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
        chatStore.addArrayLastUserRef(ref);
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLL", ref);
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLL", chatStore.arrayLastUserRef);
        // subscribe(ref);
      } else {
        if (chatStore.dataMessagesId?.unreadMessagesCount === 0) {
          lastUserRef.current = ref;
        }
        chatStore.addArrayLastUserRef(ref);
        // console.log("KKKKKKKKKKKKKKKKKKKKKKKK", ref);

        infoStore.setIdActive(ref);
      }
    }

    //якщо  всі повідомлення переглянуті
    if (chatStore.isLoadingMessagesStartId && chatStore.dataMessagesId) {
      if (
        chatStore.dataMessagesId.viewMessageId ===
        chatStore.dataMessagesId.lastMessageId
      ) {
        console.log(ref);
        lastUserRef.current = ref;
        //переходимо на останнє повідомлення
        infoStore.setIdActive(ref);
      } else {
        //якщо не всі повідомлення переглянуті
        chatStore.addArrayLastUserRef(ref);
        // subscribe(ref);
        if (lastElement.current) {
          // console.log("NNNNNNNNNNNNNNNNNNNNNNNNN", ref);
          lastUserRef.current = ref;
          //ставимо перехід на перший передивляємий елемент
          lastElement.current = false;
        }
      }
    }

    //Якщо підгрузилися  повідомлення  при скролі в низ
    if (chatStore.isLoadingNextMessages) {
      chatStore.addArrayLastUserRef(ref);
    }

    if (chatStore.isLoadingPrevNextMessages) {
      lastUserRef.current = ref;
      chatStore.addArrayLastUserRef(ref);
    }
  }
};

export { returnRef };
