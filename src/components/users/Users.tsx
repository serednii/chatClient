import React, { useState } from "react";
import styles from "./users.module.scss";
import TypingIndicator from "../TypingIndicator";

const Users = ({ usersName, userWrite, name, userStatus, leftRoom }: any) => {
  const [show, setShow] = useState(true);

  //Відкидаємо з списку себе як користувача,
  //Відкидаємо тих користувачів які набирають текст
  //Сортуємо
  const filterUsersName = usersName
    ? usersName
        .filter((user: any) => {
          const findUser = userWrite.find(
            (_user: any) => _user.name === user.name
          );
          return user.name !== name && !findUser;
        })
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
    : [];

  const filterUserWrite = userWrite
    .filter((user: any) => user.name !== name)
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

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
            (_user: any) => _user.name === user.name
          );
          const classStatus = userStatus
            ? userStatus.find((_user: any) => _user.name === user.name).status
            : "";

          return (
            <li key={index} className={classStatus + " user__message"}>
              {/* <div className={userStatus}> */}
              <h3>{user.name} </h3>
              {findUser && <TypingIndicator />}
              {/* </div> */}
            </li>
          );
        })}
    </ul>
  );
};

export default Users;
