import React, { useState } from "react";
import styles from "./users.module.scss";
import TypingIndicator from "../TypingIndicator";
import { IUsersName, IUserWrite } from "../interface";

interface IUsers {
  usersName: IUsersName[];
  userWrite: IUserWrite[];
  name: string;
  userStatus: IUsersName[];
}

const Users = ({ usersName, userWrite, name, userStatus }: IUsers) => {
  const [show, setShow] = useState(true);
  //Відкидаємо з списку себе як користувача,
  //Відкидаємо тих користувачів які набирають текст
  //Сортуємо
  const filterUsersName = usersName
    ? usersName
        .filter((user: IUsersName) => {
          const findUser = userWrite.find(
            (_user: IUserWrite) => _user.name === user.name
          );
          return user.name !== name && !findUser;
        })
        .sort((a: IUsersName, b: IUsersName) => a.name.localeCompare(b.name))
    : [];

  const filterUserWrite = userWrite
    .filter((user: IUserWrite) => user.name !== name)
    .sort((a: IUserWrite, b: IUserWrite) => a.name.localeCompare(b.name));

  //Обєднюємо два списки, першими йдуть користувачі які набирають текст а потім інші
  const newListUser = [...filterUserWrite, ...filterUsersName];

  return (
    <ul className={styles.usersName}>
      <button className={styles.title} onClick={() => setShow((prev) => !prev)}>
        List users
      </button>

      {show &&
        newListUser.map((user, index) => {
          const findUser = userWrite?.find(
            (_user: IUserWrite) => _user.name === user.name
          );

          const classStatus = userStatus
            ? userStatus.find((_user: IUsersName) => _user.name === user.name)
                ?.status
            : "";

          return (
            <li key={index} className={classStatus + " user__message"}>
              {/* <div className={userStatus}> */}
              <h3>{user?.name} </h3>
              {findUser && <TypingIndicator />}
              {/* </div> */}
            </li>
          );
        })}
    </ul>
  );
};

export default Users;
