import React from "react";
import { useState } from "react";
import styles from "../styles/Users.module.css";
import TypingIndicator from "./TypingIndicator";
// let usersName = [{ name: "John" }, { name: "Jane" }, { name: "Tom" }];
// usersName = undefined;
const Users = ({ usersName, userWrite, IAmUser }) => {
  const [show, setShow] = useState(true);
  // console.log(usersName);
  return (
    <ul className={styles.usersName}>
      <button className={styles.title} onClick={() => setShow((prev) => !prev)}>
        List users
      </button>
      {show &&
        usersName &&
        usersName.map((user, index) => {
          const findUser = userWrite.includes(user.name);

          return (
            <li key={index} className={styles.user__message}>
              <h3>{user.name} </h3>
              {findUser && user.name !== IAmUser && <TypingIndicator />}
            </li>
          );
        })}
    </ul>
  );
};

export default Users;
