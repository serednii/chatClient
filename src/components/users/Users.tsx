import React from "react";
import TypingIndicator from "../TypingIndicator";
import { IUsersName, IUserWrite } from "../interface";
import chatStore from "../../mobx/chatStore";
import { observer } from "mobx-react-lite";
import DateHourComponent from "../DateHourComponent";
import styles from "./users.module.scss";

const Users = () => {
  //Відкидаємо з списку себе як користувача,
  //Відкидаємо тих користувачів які набирають текст
  //Сортуємо
  const filterUsersName = chatStore.usersName
    ? chatStore.usersName
        .filter((user: IUsersName) => {
          const findUser = chatStore.userWrite.find(
            (_user: IUserWrite) => _user.name === user.name
          );
          return user.name !== chatStore.params.name && !findUser;
        })
        .sort((a: IUsersName, b: IUsersName) => a.name.localeCompare(b.name))
    : [];

  const filterUserWrite = chatStore.userWrite
    .filter((user: IUserWrite) => user.name !== chatStore.params.name)
    .sort((a: IUserWrite, b: IUserWrite) => a.name.localeCompare(b.name));

  //Обєднюємо два списки, першими йдуть користувачі які набирають текст а потім інші
  const newListUser = [...filterUserWrite, ...filterUsersName];

  return (
    <ul className={styles.users__items}>
      {newListUser.map((user, index) => {
        const findUser = chatStore.userWrite?.find(
          (_user: IUserWrite) => _user.name === user.name
        );

        const classStatus = chatStore.userStatus
          ? chatStore.userStatus.find(
              (_user: IUsersName) => _user.name === user.name
            )?.status
          : "";

        return (
          <li key={index} className={styles.user__message}>
            {/* <div className={userStatus}> */}

            <div className={styles.message__inner_top}>
              <img
                className={styles.message__inner_user_foto}
                src="/user_foto/icon.jfif"
                alt="foto user"
              />
              <span
                className={`${styles.message__inner_user} ${
                  styles[classStatus || ""]
                }`}
              >
                {user.name}
              </span>
              {findUser && <TypingIndicator />}
              {/* <div className={styles.message__top_hour}>
                <DateHourComponent date="12:30" />
              </div> */}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default observer(Users);
