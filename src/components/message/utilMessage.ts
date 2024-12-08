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
      chatStore.setLoadingMessage(false);
      if (
        chatStore.state[chatStore.state.length - 1].author !==
        chatStore.params.name
      ) {
        // chatStore.addArrayLastUserRef(ref); //добавляємо в масив для перегляду
        chatStore.addArrayLastUserRef(ref);
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLL", ref);

        // subscribe(ref);
      } else {
        lastUserRef.current = ref;
        infoStore.setIdActive(ref);
      }
    } else if (chatStore.isLoadingMessagesStartId && chatStore.dataMessagesId) {
      //якщо  всі повідомлення переглянуті
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
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLL", ref);
        chatStore.addArrayLastUserRef(ref);
        // subscribe(ref);

        if (lastElement.current) {
          // console.log("NNNNNNNNNNNNNNNNNNNNNNNNN", ref);
          lastUserRef.current = ref;
          //ставимо перехід на перший передивляємий елемент
          lastElement.current = false;
        }
      }
    } else if (chatStore.isLoadingNextMessages) {
      //Якщо підгрузилися  повідомлення  при скролі в низ
      chatStore.addArrayLastUserRef(ref);
    }
  }
};

export { returnRef };
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
//   infoStore.setIdActive(ref);
//   // lastElement.current = false;
// }
