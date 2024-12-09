import React, { useEffect, useRef, useState } from "react";
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
import ReadFullMessages from "./ReadFullMessages/ReadFullMessages";
import { getNextUserId } from "../Util";
import InfoNewMessage from "./infoNewMessage/InfoNewMessage";
import GotoEndMessage from "./gotoEndMessage/GotoEndMessage";

const Chat: React.FC = () => {
  // const [isReadFullMessages, setReadFullMessages] = useState<boolean>(true);
  const isReadFullMessages = useRef<boolean>(true);
  const [isStartChat, setStartChat] = useState<boolean>(false);

  // console.log("RENDER CHAT");
  useConnectHooks();
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
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  console.log(
    isStartChat,
    isReadFullMessages,
    chatStore.isMoveTop,
    chatStore.dataMessagesId?.unreadMessagesCount
  );

  return (
    <div className={styles.wrap}>
      <Header />
      <main className={styles.main}>
        <section className={styles.messages}>
          {chatStore.state.length > 0 && <Messages />}
        </section>
        <aside className={styles.users_list}>{/* <Users /> */}</aside>
        <aside className={styles.users_list}></aside>

        <aside className={styles.InfoNewMessage_wrapper}>
          {chatStore.dataMessagesId?.unreadMessagesCount === 0 ||
            (isStartChat && (
              <InfoNewMessage isReadFullMessages={isReadFullMessages} />
            ))}
        </aside>

        {/* <aside className={styles.gotoEndMessage_wrapper}>
          {isStartChat &&
            chatStore.dataMessagesId?.unreadMessagesCount === 0 &&
            chatStore.isMoveTop &&
            isReadFullMessages.current && <GotoEndMessage />}
        </aside> */}

        {/* <aside className={styles.gotoEndMessage_wrapper}>
          {isReadFullMessages && <GotoEndMessage />}
        </aside> */}
      </main>

      <Footer />
    </div>
  );
};

export default observer(Chat);
