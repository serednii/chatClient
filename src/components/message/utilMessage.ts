import { addLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";
import chatStore from "../../mobx/chatStore";
import infoStore from "../../mobx/infoStore";

//добавляємо еолементи які ще непередивлялися
const returnRef = (
  ref: HTMLLIElement | null,
  lastElement: React.MutableRefObject<boolean>,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>,
  subscribe: (nextElement: Element | null | undefined) => void
): void => {
  if (ref) {
    // console.log("CCCCCCCCCCCCCCCCCC", ref);

    //Коли добавляємо по одному повідомленню
    if (chatStore.isLoadingMessage) {
      const author = chatStore.state[chatStore.state.length - 1].author;
      if (author === "Admin") {
        // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
        lastUserRef.current = ref;
        console.log("LLLLLLLLLLLLLLLLLLLLLLLL", ref);
        console.log("LLLLLLLLLLLLLLLLLLLLLLLL", chatStore.arrayLastUserRef);
        subscribe(ref);
      } else if (author !== chatStore.params.name) {
        // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
        // chatStore.addArrayLastUserRef(ref);
        console.log("KKKKKKKKKKKKKKKKK", ref);
        console.log("KKKKKKKKKKKKKKKKK", chatStore.arrayLastUserRef);
        subscribe(ref);
      } else {
        if (chatStore.dataMessagesId?.unreadMessagesCount === 0) {
          lastUserRef.current = ref;
        }
        // chatStore.addArrayLastUserRef(ref);
        // console.log("KKKKKKKKKKKKKKKKKKKKKKKK", ref);
        subscribe(ref);

        infoStore.setIdActive(ref);
      }
    }

    //якщо  всі повідомлення переглянуті
    if (chatStore.isLoadingMessagesStartId && chatStore.dataMessagesId) {
      if (
        chatStore.dataMessagesId.viewMessageId ===
        chatStore.dataMessagesId.lastMessageId
      ) {
        // console.log(ref);
        lastUserRef.current = ref;
        //переходимо на останнє повідомлення
        infoStore.setIdActive(ref);
      } else {
        //якщо не всі повідомлення переглянуті
        // chatStore.addArrayLastUserRef(ref);
        subscribe(ref);
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
      // chatStore.addArrayLastUserRef(ref);
      subscribe(ref);
    }

    if (chatStore.isLoadingPrevNextMessages) {
      lastUserRef.current = ref;
      // chatStore.addArrayLastUserRef(ref);
      subscribe(ref);
    }
  }
};

function areDifferentDays(prevDate: string, todayDate: string) {
  const prev = new Date(prevDate);
  const today = new Date(todayDate);

  // Порівнюємо тільки рік, місяць і день
  return (
    prev.getFullYear() !== today.getFullYear() ||
    prev.getMonth() !== today.getMonth() ||
    prev.getDate() !== today.getDate()
  );
}

export { returnRef, areDifferentDays };
