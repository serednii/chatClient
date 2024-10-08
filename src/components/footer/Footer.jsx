import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import icon from "../../images/emoji.svg";
import styles from "./footer.module.css";

const Footer = ({ handleSubmit, onEmojiClick, handleChange, message }) => {
  const [isOpen, setOpen] = useState(false);
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
          <input type="submit" onSubmit={handleSubmit} value="Send a message" />
        </div>
      </form>
    </footer>
  );
};

export default Footer;
