import React from "react";
import { useState } from "react";
import styles from "../styles/Users.module.css";
// let usersName = [{ name: "John" }, { name: "Jane" }, { name: "Tom" }];
// usersName = undefined;
const Users = ({ usersName, userWrite }) => {
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
            <li key={index} className={styles.user}>
              <h3>
                {user.name} {findUser && "..."}
              </h3>
            </li>
          );
        })}
    </ul>
  );
};

export default Users;
