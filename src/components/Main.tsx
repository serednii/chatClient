import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthUser from "../AuthUser/components/AuthUser/AuthUser";
import authStore from "../AuthUser/mobx/AuthStore";

import Input from "./Input";
import { IParams } from "./interface";
import { THandleChange } from "./type";
import styles from "../styles/Main.module.scss";
import { observer } from "mobx-react-lite";

const Main = () => {
  // const location = useLocation();
  const [values, setValues] = useState<IParams>({ name: "", room: "" });
  // console.log(values);

  const handleChange: THandleChange = ({ target: { name, value } }) => {
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
            <Input
              value={values.name}
              handleChange={handleChange}
              style={styles.input}
              name="name"
              placeholder="UserName"
            />
          </div>

          <div className={styles.group}>
            <Input
              value={values.room}
              handleChange={handleChange}
              style={styles.input}
              name="room"
              placeholder='Room (input "test")'
            />
          </div>

          <Link
            className={styles.group}
            onClick={handleClick}
            // to={`/chat?name=${authStore.user.userName}&room=${values.room}`}
            to={`/chat?name=${values.name}&room=${values.room}`}
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

export default observer(Main);
