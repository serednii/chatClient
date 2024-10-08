import styles from "./header.module.css";

const Header = ({ leftRoom, params, users, isWrite }) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>
        Room {params.room} Name {params.name}{" "}
        {isWrite && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </h2>
      <div className={styles.users}>{users} users in this room</div>
      <button className={styles.left} onClick={leftRoom}>
        Left the room
      </button>
    </header>
  );
};

export default Header;
