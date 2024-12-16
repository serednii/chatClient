import React, { useEffect, useMemo, useRef, useState } from "react";
import Messages from "../message/Messages";
import Users from "../users/Users";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import chatStore from "../../mobx/chatStore";
import styles from "./Chat.module.scss";
import { observer } from "mobx-react-lite";

import { clearSetWrite } from "./controllerChat";
import { handleChangeChat } from "../footer/controllerFooter";
import useConnectHooks from "../socket/useSocketControllers";
import InfoNewMessage from "./infoNewMessage/InfoNewMessage";
import GotoEndMessage from "./gotoEndMessage/GotoEndMessage";
import useIntersectionObserver from "../message/useIntersectionObserver";

const Chat: React.FC = () => {
  // const [isReadFullMessages, setReadFullMessages] = useState<boolean>(true);
  const isReadFullMessages = useRef<boolean>(true);
  const [isStartChat, setStartChat] = useState<boolean>(false);

  useConnectHooks();
  // console.log("RENDER CHAT");

  useEffect(() => {
    if (chatStore.isDeleteMessage) {
      handleChangeChat();
    } else {
      clearSetWrite();
    }
  }, [chatStore.isDeleteMessage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStartChat(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const { subscribe, observerRef } = useIntersectionObserver();
  // console.log(subscribe, observerRef);
  // console.log(
  //   isStartChat,
  //   isReadFullMessages,
  //   chatStore.isMoveTop,
  //   chatStore.dataMessagesId?.unreadMessagesCount
  // );

  return (
    <div className={styles.wrap}>
      <Header />
      <main className={styles.main}>
        <aside>
          <Users />
        </aside>
        <section className={styles.messages}>
          {chatStore.state.length > 0 && <Messages subscribe={subscribe} />}
        </section>
        {/* <aside className={styles.users_list}></aside> */}

        <aside className={styles.InfoNewMessage_wrapper}>
          {chatStore.dataMessagesId?.unreadMessagesCount === 0 ||
            (isStartChat && (
              <InfoNewMessage isReadFullMessages={isReadFullMessages} />
            ))}
        </aside>

        <aside className={styles.gotoEndMessage_wrapper}>
          {isStartChat &&
            chatStore.dataMessagesId?.unreadMessagesCount === 0 &&
            chatStore.isMoveTop &&
            isReadFullMessages.current && <GotoEndMessage />}
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default observer(Chat);
