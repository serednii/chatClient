import { MutableRefObject } from "react";
import { IData } from "./interface";

interface IControllerMessages {
  handleDeleteMessage: (
    divRef: MutableRefObject<HTMLDivElement | null>,
    deleteMessageById: (id: number) => void,
    setBlockLastUserRef: (value: boolean) => void
  ) => void;

  handleEditMessage: (
    divRef: MutableRefObject<HTMLDivElement | null>,
    setData: (value: IData) => void,
    setValues: (value: string) => void,
    setIsEditMessage: (value: boolean) => void,
    setBlockLastUserRef: (value: boolean) => void
  ) => void;

  handleClose: (
    event: React.MouseEvent<HTMLButtonElement>,
    setIsEditMessage: (value: boolean) => void
  ) => void;

  handleSendMessage: (
    event: React.MouseEvent<HTMLButtonElement>,
    setIsEditMessage: (value: boolean) => void,
    updateMessageById: (id: number, message: string) => void,
    data: IData,
    values: string
  ) => void;
}

const controllerMessages: IControllerMessages = {
  handleDeleteMessage: (divRef, deleteMessageById, setBlockLastUserRef) => {
    if (divRef.current) {
      const dataIdStr = divRef.current.getAttribute("data-id");
      if (dataIdStr) {
        const dataId = parseInt(dataIdStr);
        /* eslint-disable no-restricted-globals */
        if (confirm("Ви впевнені, що хочете видалити повідомлення")) {
          deleteMessageById(dataId);
        }
      }
      /* eslint-enable no-restricted-globals */
    }
    setBlockLastUserRef(false); // Простий виклик для boolean значення
    setTimeout(() => setBlockLastUserRef(true), 2050); // Функція для оновлення стану на основі попереднього значення
  },

  handleEditMessage: (
    divRef,
    setData,
    setValues,
    setIsEditMessage,
    setBlockLastUserRef
  ) => {
    if (divRef.current) {
      const dataIdStr: string | null = divRef.current.getAttribute("data-id");
      const dataMessage: string | undefined = divRef.current.innerText;
      if (dataIdStr && dataMessage) {
        setData({
          dataIdStr,
          dataMessage,
        });
      }
      setValues(dataMessage);
      setIsEditMessage(true);
      setBlockLastUserRef(false);
      setTimeout(() => setBlockLastUserRef(true), 2050);
    }
  },
  handleClose: (event, setIsEditMessage) => {
    event.preventDefault();
    setIsEditMessage(false);
  },
  handleSendMessage: (
    event,
    setIsEditMessage,
    updateMessageById,
    data,
    values
  ) => {
    event.preventDefault();
    if (data) {
      const dataId = parseInt(data?.dataIdStr);
      updateMessageById(dataId, values);
    }
    setTimeout(() => setIsEditMessage(false), 150);
  },
};

export default controllerMessages;
