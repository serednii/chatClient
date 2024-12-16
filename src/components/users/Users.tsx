import React from "react";
import { observer } from "mobx-react-lite";
import chatStore from "../../mobx/chatStore";
import { ILastUserVisitTime, IUsersName, IUserWrite } from "../interface";
import User from "./User";
import styles from "./users.module.scss";

const filterSortUsers = () => {
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
  return filterUsersName;
};

const Users = () => {
  //Відкидаємо з списку себе як користувача,
  //Відкидаємо тих користувачів які набирають текст
  //Сортуємо

  const filterUsersName = filterSortUsers();

  return (
    <ul key="users1" className={styles.users__items}>
      {filterUsersName.map((user, index) => {
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
        );
      })}
    </ul>
  );
};

export default observer(Users);
