import { useState } from "react";
import styles from "../styles/Users.module.css";
import TypingIndicator from "./TypingIndicator";

const Users = ({ usersName, userWrite, name }) => {
  const [show, setShow] = useState(true);

  //Відкидаємо з списку себе як користувача,
  //Відкидаємо тих користувачів які набирають текст
  //Сортуємо
  const filterUsersName = usersName
    ? usersName
        .filter((user) => {
          const findUser = userWrite.find((_user) => _user.name === user.name);
          return user.name !== name && !findUser;
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const filterUserWrite = userWrite
    .filter((user) => user.name !== name)
    .sort((a, b) => a.name.localeCompare(b.name));

  //Обєднюємо два списки, першими йдуть користувачі які набирають текст а потім інші
  const newListUser = [...filterUserWrite, ...filterUsersName];

  return (
    <ul className={styles.usersName}>
      <button className={styles.title} onClick={() => setShow((prev) => !prev)}>
        List users
      </button>

      {show &&
        newListUser.map((user, index) => {
          const findUser = userWrite.find((_user) => _user.name === user.name);
          return (
            <li key={index} className={styles.user__message}>
              <h3>{user.name} </h3>
              {findUser && <TypingIndicator />}
            </li>
          );
        })}
    </ul>
  );
};

export default Users;
