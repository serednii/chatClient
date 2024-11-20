import { useCallback } from "react";
import { Socket } from "socket.io-client";
import { IParams, IState } from "../interface";

interface IControllerChat {
  deleteMessageStateById(
    id: number,
    state: IState,
    setState: (value: any) => void
  ): void; // Виправлено тут
  updateMessageStateById(
    id: number,
    message: string,
    state: IState,
    setState: (value: any) => void
  ): void;
  //   clearSetWrite(
  //     params: IParams,
  //     socket: Socket,
  //     setWrite: (value: boolean) => void
  //   ): void;
  //   deleteMessageById(id: number, socket: Socket, params: IParams): void;
}

//
//
//
//
//
//
//

const controllerChat: IControllerChat = {
  deleteMessageStateById: (id, state, setState) => {
    const newMessages = state?.message?.messages?.filter(
      (message) => message.id !== id
    );
    if (state && newMessages) {
      // setState(structuredClone(state));
      setState((prevState: any) => {
        if (!prevState) {
          return prevState; // або поверніть початковий стан, якщо це необхідно
        }
        return {
          ...prevState,
          message: {
            ...prevState.message,
            messages: newMessages,
          },
        };
      });
    }
  },

  updateMessageStateById: (id, message, state, setState): void => {
    const newMessages = state?.message?.messages?.find(
      (message) => message.id === id
    );

    if (newMessages) {
      newMessages.message = message;
    }

    if (state && newMessages) {
      // setState(structuredClone(state));
      setState((prevState: any) => {
        if (!prevState) {
          return prevState; // або поверніть початковий стан, якщо це необхідно
        }
        return {
          ...prevState,
          message: {
            ...prevState.message,
          },
        };
      });
    }
  },
  //   clearSetWrite: useCallback(
  //     (params, socket, setWrite): void => {
  //       setWrite(false);
  //       // console.log(socket);
  //       socket?.emit("sendWrite", { isWrite: false, params });
  //     },
  //     [socket]
  //   ),
  //   deleteMessageById: (id, socket, params) => {
  //     if (socket) {
  //       socket.emit("deleteMessageById", { id, room: params.room });
  //     }
  //   },
};

export default controllerChat;
