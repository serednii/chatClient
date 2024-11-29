import React, { useEffect } from "react";
import Messages from "../message/Messages";
import Users from "../users/Users";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import useWebSocket from "../socket/useWebsocket";
import chatStore from "../../mobx/chatStore";
import styles from "./Chat.module.scss";
import { observer } from "mobx-react-lite";

import { clearSetWrite } from "./controllerChat";
import { handleChangeChat } from "../footer/controllerFooter";
import useConnectHooks from "../socket/useSocketControllers";

const Chat: React.FC = () => {
  console.log("RENDER CHAT");
  useConnectHooks();
  useEffect(() => {
    if (chatStore.isDeleteMessage) {
      handleChangeChat();
    } else {
      clearSetWrite();
    }
  }, [chatStore.isDeleteMessage]);

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
      </main>

      <Footer />
    </div>
  );
};

export default observer(Chat);
