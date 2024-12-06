import { observer } from "mobx-react-lite";
import chatStore from "../../../mobx/chatStore";
import { LiaArrowCircleDownSolid } from "react-icons/lia";
import styles from "./InfoNewMessage.module.scss";
import { sendNextPrevMessagesServer } from "../../socket/setDataSocket";
import { getNextUserId } from "../../Util";

const InfoNewMessage = () => {
  const handleClick = (event: any) => {
    event.preventDefault();
    // chatStore.setArrayLastUserRef([]);
    // chatStore.setLoadingNextMessagesScroll(true);
    const lastId = getNextUserId(chatStore.state) || 1;

    const newData = {
      ...chatStore.dataMessagesId,
      viewMessageId: chatStore.dataMessagesId?.lastMessageId,
    };

    console.log("LLLLLLLLLLLLLLLLL", chatStore.dataMessagesId?.lastMessageId);
    sendNextPrevMessagesServer({
      name: chatStore.params.name,
      room: chatStore.params.room,
      startID: chatStore.dataMessagesId?.lastMessageId || 1,
      limit: 50,
    });
  };

  return (
    <div className={styles.infoNewMessage}>
      You have {chatStore.dataMessagesId?.unreadMessagesCount} new{" "}
      {chatStore.dataMessagesId?.unreadMessagesCount === 1
        ? "message"
        : "messages"}
      <button onClick={handleClick}>
        <LiaArrowCircleDownSolid style={{ fontSize: "40px", color: "red" }} />
      </button>
    </div>
  );
};

export default observer(InfoNewMessage);
