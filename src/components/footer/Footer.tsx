import EmojiPicker from "emoji-picker-react";
import React, { useCallback, useEffect, useRef, memo } from "react";
import { useState } from "react";
import { IParams } from "../interface";
import { debounce } from "../Util";
import chatStore from "../../mobx/chatStore";
import {
  THandleChange,
  TDebouncedFunction,
  TGetTimer,
  TDebounce,
} from "../type";
import styles from "./footer.module.scss";
const icon = require("../../images/emoji.svg");

const Footer: React.FC<any> = ({
  handleSubmitChat,
  handleChangeChat,
  onEmojiClick,
  params,
  clearSetWrite,
}) => {
  const [isOpen, setOpen] = useState(false);
  const debouncedFunctionRef = useRef<TDebouncedFunction | null>(null);
  const getTimerRef = useRef<TGetTimer | null>(null);
  const [message, setMessage] = useState<string>("");
  console.log("RENDER FOOTER");
  const [debouncedFunction, getTimer]: TDebounce = debounce(
    (params: IParams) => {
      clearSetWrite(); // Ваш код
    },
    6000
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!message) return;
    if (getTimerRef.current) {
      clearTimeout(getTimerRef.current());
    }
    handleSubmitChat(message);
    setMessage("");
  };

  useEffect(() => {
    debouncedFunctionRef.current = debouncedFunction;
  }, [chatStore.socket]);

  if (!getTimerRef.current) {
    getTimerRef.current = getTimer;
  }

  const handleChange: THandleChange = ({ target: { value } }) => {
    handleChangeChat();

    if (debouncedFunctionRef.current) {
      debouncedFunctionRef.current(params);
    }
    setMessage(() => value);
  };

  return (
    <footer className={styles.footer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="What do you want to say?"
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />

          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className={styles.button}>
          <input type="submit" value="Send a message" />
        </div>
      </form>
    </footer>
  );
};

export default memo(Footer);
