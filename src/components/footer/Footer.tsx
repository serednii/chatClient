import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, memo } from "react";
import { useState } from "react";
import { IParams } from "../interface";
import { debounce } from "../Util";
import chatStore from "../../mobx/chatStore";
import { BsEmojiTear } from "react-icons/bs";
import {
  THandleChange,
  TDebouncedFunction,
  TGetTimer,
  TDebounce,
} from "../type";
import styles from "./footer.module.scss";
import { observer } from "mobx-react-lite";
import {
  handleChangeChat,
  handleSubmitChat,
  onEmojiClick,
} from "./controllerFooter";
import { clearSetWrite } from "../chat/controllerChat";
const icon = require("../../images/emoji.svg");

const Footer: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const debouncedFunctionRef = useRef<TDebouncedFunction | null>(null);
  const getTimerRef = useRef<TGetTimer | null>(null);
  const [message, setMessage] = useState<string>("");

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
    setOpen(false);
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
      debouncedFunctionRef.current(chatStore.params);
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
          <p
            onClick={(e) => {
              e.preventDefault();
              setOpen(!isOpen);
            }}
          >
            {" "}
            😘
          </p>
          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker
                onEmojiClick={(emoji) =>
                  onEmojiClick(emoji, message, setMessage)
                }
              />
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

export default memo(observer(Footer));
