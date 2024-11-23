import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { URL_SERVER } from "../config";
import chatStore from "../mobx/chatStore";

interface IParams {
  room: string;
  name: string;
}

const useWebSocket = (params: IParams) => {
  const paramsRef = useRef<IParams>(params);
  const reconnectIntervalRef = useRef<number>(1000);
  const isFirstConnect = useRef<boolean>(true);
  // Оновлюємо реф params при кожній зміні
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const getParams = useCallback(() => paramsRef.current, []);

  useEffect(() => {
    const newSocket: Socket = io(URL_SERVER, {
      path: "/socket",
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: reconnectIntervalRef.current,
      reconnectionDelayMax: 30000,
    });

    chatStore.setSocket(newSocket);

    const handleReconnect = () => {
      console.log("WebSocket connection reestablished");

      //При першому підключенні пропускаємо відправку join
      if (isFirstConnect.current) {
        console.log("First WebSocket connection established");
        isFirstConnect.current = false; // Встановлюємо реф у false після першого підключення
      } else {
        console.log("WebSocket connection reestablished");
        newSocket.emit("join", getParams());
      }

      reconnectIntervalRef.current = 1000; // Скидаємо інтервал перепідключення
    };

    const handleDisconnect = () => {
      console.log("WebSocket connection lost, attempting to reconnect...");
      reconnectIntervalRef.current = Math.min(
        reconnectIntervalRef.current * 2,
        30000
      ); // Експоненціальне збільшення до 30 секунд
    };

    const handleError = (error: any) => {
      console.error("WebSocket error observed:", error);
    };

    newSocket.on("connect", handleReconnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("error", handleError);

    return () => {
      newSocket.off("connect", handleReconnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("error", handleError);
      newSocket.disconnect();
    };
  }, [URL_SERVER, getParams]);

  return {};
};

export default useWebSocket;
