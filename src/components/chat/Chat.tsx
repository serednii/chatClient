import React, { useEffect, useState } from "react";
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

const Chat: React.FC = () => {
  const [isReadFullMessages, setReadFullMessages] = useState(false);
  console.log("RENDER CHAT");
  useConnectHooks();
  useEffect(() => {
    if (chatStore.isDeleteMessage) {
      handleChangeChat();
    } else {
      clearSetWrite();
    }
  }, [chatStore.isDeleteMessage]);
  useEffect(() => {
    const lastId = getNextUserId(chatStore.state);
    setReadFullMessages(lastId !== chatStore.dataMessagesId?.lastMessageId);
  }, [chatStore.state, chatStore.dataMessagesId?.lastMessageId]);

  return (
    <div className={styles.wrap}>
      <Header />
      <main className={styles.main}>
        <section className={styles.messages}>
          {chatStore.state.length > 0 && <Messages />}
        </section>
        <aside className={styles.users_list}>
          <Users />
        </aside>
        <aside className={styles.users_list}>
          {/* {isReadFullMessages && <ReadFullMessages />} */}
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default observer(Chat);
