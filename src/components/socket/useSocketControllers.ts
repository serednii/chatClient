import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import chatStore from "../../mobx/chatStore";
import { IParams } from "../interface";

export const useJoin = () => {
  const hasJoined = useRef(false);
  const { search } = useLocation();
  useEffect(() => {
    if (!chatStore.socket) return;

    if (!hasJoined.current) {
      console.log("JOIN----------------------------", search);
      const searchParamsObj = Object.fromEntries(new URLSearchParams(search));
      const searchParams: IParams = {
        name: searchParamsObj.name || "",
        room: searchParamsObj.room || "",
      };
      if (searchParams.name && searchParams.room) {
        chatStore.setParams(searchParams);
        chatStore.socket.emit("join", searchParams);
        hasJoined.current = true; // Позначаємо, що користувач уже приєднався
      } else {
        console.error("Missing required search parameters: name and/or room.");
      }
    }
  }, [chatStore.socket, search]);
  return {};
};
