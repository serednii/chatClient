import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthUser from "../AuthUser/components/AuthUser/AuthUser";
import authStore from "../AuthUser/mobx/AuthStore";

import styles from "../styles/Main.module.scss";
import Input from "./Input";

const FIELDS = {
  NAME: "name",
  ROOM: "room",
};
// type IHandleChange = ({ target: { value: string, name: string } }) => void;
type IHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => void;

const Main = () => {
  const { NAME, ROOM } = FIELDS;
  const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });
  console.log(values);

  const handleChange: IHandleChange = ({ target: { name, value } }) => {
    // console.log(event);
    setValues({ ...values, [name]: value });
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ): void => {
    const isDisabled = Object.values(values).some((v) => !v);
    if (isDisabled) e.preventDefault();
  };

  return (
    <div className={styles.wrap}>
      {/* <AuthUser></AuthUser> */}
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>

        <form className={styles.form}>
          <div className={styles.group}>
            {/* <input
              type="text"
              name="name"
              value={values[NAME]}
              placeholder="Username"
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            /> */}

            <Input
              value={values[NAME]}
              handleChange={handleChange}
              style={styles.input}
              name="name"
              placeholder="UserName"
            />
          </div>

          <div className={styles.group}>
            {/* <input
              type="text"
              name="room"
              placeholder="Room"
              value={values[ROOM]}
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            /> */}

            <Input
              value={values[ROOM]}
              handleChange={handleChange}
              style={styles.input}
              name="room"
              placeholder="Room"
            />
          </div>

          <Link
            className={styles.group}
            onClick={handleClick}
            // to={`/chat?name=${authStore.user.userName}&room=${values[ROOM]}`}
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
          >
            <button type="submit" className={styles.button}>
              Join the room
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
