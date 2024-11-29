import React, { memo } from "react";
import { IParams } from "../interface";
import chatStore from "../../mobx/chatStore";
import styles from "./header.module.scss";
import { observer } from "mobx-react-lite";
import { sendLeftRoomToServer } from "../socket/setDataSocket";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  //Left the room
  const leftRoom = (): void => {
    sendLeftRoomToServer();
    navigate("./main");
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>
        Room {chatStore.params.room} Name {chatStore.params.name}{" "}
        {chatStore.isWrite && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </h2>
      <div className={styles.users}>{chatStore.users} users in this room</div>
      <button className={styles.left} onClick={leftRoom}>
        Left the room
      </button>
    </header>
  );
};

export default memo(observer(Header));
