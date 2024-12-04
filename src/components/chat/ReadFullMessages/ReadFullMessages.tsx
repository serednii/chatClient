import styles from "./ReadFullMessages.module.scss";

const ReadFullMessages = () => {
  const handleClick = () => {};

  return (
    <div className={styles.ReadFullMessages}>
      <button onClick={handleClick}>Пропустити всі повідомлення</button>
    </div>
  );
};

export default ReadFullMessages;
