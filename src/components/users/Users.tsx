import React from "react";
import TypingIndicator from "../TypingIndicator";
import { ILastUserVisitTime, IUsersName, IUserWrite } from "../interface";
import chatStore from "../../mobx/chatStore";
import { observer } from "mobx-react-lite";

import DateComponent from "../DateComponent";
import GeneratorAvatar from "../generatorAvatar/GeneratorAvatar";
import styles from "./users.module.scss";
import User from "./User";

const Users = () => {
  //Відкидаємо з списку себе як користувача,
  //Відкидаємо тих користувачів які набирають текст
  //Сортуємо
  const filterUsersName: IUsersName[] = chatStore.usersName
    ? [...chatStore.usersName]
        .sort((a: IUsersName, b: IUsersName) => {
          const findA: ILastUserVisitTime | undefined =
            chatStore.lastUserVisitTime.find(
              (userVisit: ILastUserVisitTime) => userVisit.user_name === a.name
            );
          const findB: ILastUserVisitTime | undefined =
            chatStore.lastUserVisitTime.find(
              (userVisit: ILastUserVisitTime) => userVisit.user_name === b.name
            );

          // Якщо будь-якого користувача немає в lastUserVisitTime
          if (!findA || !findB) {
            return !findA ? 1 : -1;
          }

          const dateA: number = new Date(findA.last_visit_date).getTime();
          const dateB: number = new Date(findB.last_visit_date).getTime();

          // Порівняння дат
          return dateB - dateA; // Зворотне сортування: останні візити на початку
        })
        .filter((user: IUserWrite) => user.name !== chatStore.params.name)
    : [];

  //Обєднюємо два списки, першими йдуть користувачі які набирають текст а потім інші
  const newListUser = [...filterUsersName];

  return (
    <ul key="users1" className={styles.users__items}>
      {newListUser.map((user, index) => {
        const findUser: IUserWrite | undefined = chatStore.userWrite?.find(
          (_user: IUserWrite) => _user.name === user.name
        );

        const classStatus: string | undefined = chatStore.userStatus
          ? chatStore.userStatus.find(
              (_user: IUsersName) => _user.name === user.name
            )?.status
          : "";

        const lastDateVisit: ILastUserVisitTime | undefined =
          user.name !== chatStore.params.name
            ? chatStore.getLastUserVisitTimeByName(user.name)
            : undefined;

        return (
          <User
            key={index}
            user={user}
            lastDateVisit={lastDateVisit}
            classStatus={classStatus}
            findUser={findUser}
          />

          // <li key={index} className={styles.user__message}>
          //   <div className={styles.message__inner_top}>
          //     {!lastDateVisit?.avatar ? (
          //       <div className={styles.message__inner_user_avatar}>
          //         <GeneratorAvatar userName={user.name} />
          //       </div>
          //     ) : (
          //       <img
          //         className={styles.message__inner_user_avatar}
          //         src={`/user_foto/${lastDateVisit?.avatar}`}
          //         alt="foto user"
          //       />
          //     )}

          //     <div
          //       className={`${styles.message__inner_user} ${
          //         styles[classStatus || ""]
          //       }`}
          //     >
          //       <span> {user.name}</span>
          //       {findUser && <TypingIndicator />}
          //     </div>

          //     <span>
          //       {<DateComponent date={lastDateVisit?.last_visit_date} />}
          //     </span>
          //   </div>
          // </li>
        );
      })}
    </ul>
  );
};

export default observer(Users);
