import { addLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";
import chatStore from "../../mobx/chatStore";
import infoStore from "../../mobx/infoStore";

//добавляємо еолементи які ще непередивлялися
const returnRef = (
  ref: HTMLLIElement | null,
  startLastUserRef: boolean,
  isMyMessage: boolean,
  // arrayLastUserRef: React.MutableRefObject<(HTMLLIElement | null)[]>,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>,
  subscribe: (nextElement: HTMLLIElement | null) => void
): void => {
  // console.log("CCCCCCCCCCCCCCCCCC", ref, lastUserRef.current);
  if (!lastUserRef.current) {
    console.log("KKKKKKKKKKKKKKIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIKKK", ref);

    //Перший елемент записуємо в реф для переходу
    lastUserRef.current = ref;
    infoStore.setIdActive(ref);
    startLastUserRef = false;
  } else if (chatStore.isLoadingDataFuncReturn) {
    console.log("YYYYYYYYYYYYYYYYYY", ref);
    infoStore.setIdActive(ref);
    lastUserRef.current = chatStore.activeRef;
    chatStore.setLoadingDataFuncReturn(false);
  } else {
    if (isMyMessage) {
      //моє повідомлення
      // console.log("XXXXXXXXXXXXXXXX");
      if (chatStore.arrayLastUserRef.length === 0) {
        // console.log("LLLLLLLLLLLLLLLLL");

        //і всі повідомлення переглянуті
        lastUserRef.current = ref; //Добаляємо його в скрол
        // console.log(lastUserRef.current);
        const idString: string | null = ref?.getAttribute("data-id") || null;
        if (idString) {
          const idNumber = parseInt(idString);
          // console.log("12121212212", idNumber);
          // idNumber && addLastIdMessageViewLocalStorage(idNumber);
        }
      } else {
        // console.log("NNNNNNNNNNNNNNNNNNNN");

        chatStore.arrayLastUserRef.push(ref); //добавляємо в масив для перегляду
        subscribe(
          chatStore.arrayLastUserRef[chatStore.arrayLastUserRef.length - 1]
        );
      }
    } else {
      // console.log("ZZZZZZZZZZZZZZZZZZZZZZ");
      //чуже повідомлення то добавляємо в масив
      chatStore.arrayLastUserRef.push(ref);
      subscribe(
        chatStore.arrayLastUserRef[chatStore.arrayLastUserRef.length - 1]
      );
    }
  }
};

export { returnRef };
