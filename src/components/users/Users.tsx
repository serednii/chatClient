import React from "react";
import TypingIndicator from "../TypingIndicator";
import { ILastUserVisitTime, IUsersName, IUserWrite } from "../interface";
import chatStore from "../../mobx/chatStore";
import { observer } from "mobx-react-lite";

import styles from "./users.module.scss";
import DateComponent from "../DateComponent";
import GeneratorAvatar from "../generatorAvatar/GeneratorAvatar";

const Users = () => {
  //Відкидаємо з списку себе як користувача,
  //Відкидаємо тих користувачів які набирають текст
  //Сортуємо
  const filterUsersName = chatStore.usersName
    ? [...chatStore.usersName]
        .sort((a: IUsersName, b: IUsersName) => {
          const findA = chatStore.lastUserVisitTime.find(
            (userVisit: ILastUserVisitTime) => userVisit.user_name === a.name
          );
          const findB = chatStore.lastUserVisitTime.find(
            (userVisit: ILastUserVisitTime) => userVisit.user_name === b.name
          );

          // Якщо будь-якого користувача немає в lastUserVisitTime
          if (!findA || !findB) {
            return !findA ? 1 : -1;
          }

          const dateA = new Date(findA.last_visit_date).getTime();
          const dateB = new Date(findB.last_visit_date).getTime();

          // Порівняння дат
          return dateB - dateA; // Зворотне сортування: останні візити на початку
        })
        .filter((user: IUserWrite) => user.name !== chatStore.params.name)
    : [];

  // chatStore.lastUserVisitTime.find(
  //   (userVisit: ILastUserVisitTime) =>
  //     userVisit.user_name === user.name && user.name !== chatStore.params.name
  // );

  // const filterUserWrite = chatStore.userWrite.filter(
  //   (user: IUserWrite) => user.name !== chatStore.params.name
  // );
  // .sort((a: IUserWrite, b: IUserWrite) => a.name.localeCompare(b.name));

  //Обєднюємо два списки, першими йдуть користувачі які набирають текст а потім інші
  const newListUser = [...filterUsersName];
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

        const lastDateVisit = chatStore.lastUserVisitTime.find(
          (userVisit: ILastUserVisitTime) =>
            userVisit.user_name === user.name &&
            user.name !== chatStore.params.name
        );

        return (
          <li key={index} className={styles.user__message}>
            {/* <div className={userStatus}> */}

            <div className={styles.message__inner_top}>
              {/* <img
                className={styles.message__inner_user_foto}
                src="/user_foto/Lena.png"
                alt="foto user"
              /> */}
              <div className={styles.message__inner_user_avatar}>
                <GeneratorAvatar userName={user.name} />
              </div>

              <div
                className={`${styles.message__inner_user} ${
                  styles[classStatus || ""]
                }`}
              >
                <span> {user.name}</span>
                {findUser && <TypingIndicator />}
              </div>

              <span>
                {<DateComponent date={lastDateVisit?.last_visit_date} />}
              </span>
              {/* {findUser && <TypingIndicator />} */}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default observer(Users);
