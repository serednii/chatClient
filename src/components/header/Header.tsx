import React from "react";
import { IParams } from "../interface";
import chatStore from "../../mobx/chatStore";
import styles from "./header.module.scss";

interface IHeader {
  leftRoom: () => void;
  params: IParams;
  users: number;
}
const Header: React.FC<IHeader> = ({ leftRoom, params, users }) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>
        Room {params.room} Name {params.name}{" "}
        {chatStore.isWrite && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </h2>
      <div className={styles.users}>{users} users in this room</div>
      <button className={styles.left} onClick={leftRoom}>
        Left the room
      </button>
    </header>
  );
};

export default Header;
