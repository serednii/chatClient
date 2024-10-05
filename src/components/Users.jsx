import { useState } from "react";
import styles from "../styles/Users.module.css";
import TypingIndicator from "./TypingIndicator";

const Users = ({ usersName, userWrite, name }) => {
  const [show, setShow] = useState(true);

  const usersNameYesWrite = usersName
    ? usersName
        .filter((user) => user.name !== name)
        .sort((a, b) => a.name.localeCompare(b.name))
    : null;

  console.log("usersNameYesWrite", usersNameYesWrite);
  return (
    <ul className={styles.usersName}>
      <button className={styles.title} onClick={() => setShow((prev) => !prev)}>
        List users
      </button>

      {show &&
        usersNameYesWrite &&
        usersNameYesWrite.map((user, index) => {
          const findUser = userWrite.includes(user.name);
          const itsMe =
            user.name.trim().toLowerCase() === name.trim().toLowerCase();

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
