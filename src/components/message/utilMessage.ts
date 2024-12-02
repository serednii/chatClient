import { addLastIdMessageViewLocalStorage } from "../../localStorage/localStorage";

//добавляємо еолементи які ще непередивлялися
const returnRef = (
  ref: HTMLLIElement | null,
  startLastUserRef: boolean,
  isMyMessage: boolean,
  arrayLastUserRef: React.MutableRefObject<(HTMLLIElement | null)[]>,
  lastUserRef: React.MutableRefObject<HTMLLIElement | null>,
  subscribe: (nextElement: HTMLLIElement | null) => void
): void => {
  console.log("CCCCCCCCCCCCCCCCCC", ref, lastUserRef.current);
  if (!lastUserRef.current) {
    console.log("KKKKKKKKKKKKKKLKKK", ref);

    //Перший елемент записуємо в реф для переходу
    lastUserRef.current = ref;
    startLastUserRef = false;
  } else {
    if (isMyMessage) {
      //моє повідомлення
      console.log("XXXXXXXXXXXXXXXX");
      if (arrayLastUserRef.current.length === 0) {
        console.log("LLLLLLLLLLLLLLLLL");

        //і всі повідомлення переглянуті
        lastUserRef.current = ref; //Добаляємо його в скрол
        console.log(lastUserRef.current);
        const idString: string | null = ref?.getAttribute("data-id") || null;
        if (idString) {
          const idNumber = parseInt(idString);
          console.log("12121212212", idNumber);
          idNumber && addLastIdMessageViewLocalStorage(idNumber);
        }
      } else {
        console.log("NNNNNNNNNNNNNNNNNNNN");

        arrayLastUserRef.current.push(ref); //добавляємо в масив для перегляду
        subscribe(
          arrayLastUserRef.current[arrayLastUserRef.current.length - 1]
        );
      }
    } else {
      console.log("ZZZZZZZZZZZZZZZZZZZZZZ");
      //чуже повідомлення то добавляємо в масив
      arrayLastUserRef.current.push(ref);
      subscribe(arrayLastUserRef.current[arrayLastUserRef.current.length - 1]);
    }
  }
};

export { returnRef };
