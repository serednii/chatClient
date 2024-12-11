import { observer } from "mobx-react-lite";
import chatStore from "../../../mobx/chatStore";
import { LiaArrowCircleDownSolid } from "react-icons/lia";
import styles from "./InfoNewMessage.module.scss";
import {
  sendNextPrevMessagesServer,
  sendStartNum,
} from "../../socket/setDataSocket";
import { getNextUserId } from "../../Util";
interface InfoNewMessageProps {
  isReadFullMessages: React.MutableRefObject<boolean>;
}
const InfoNewMessage: React.FC<InfoNewMessageProps> = ({
  isReadFullMessages,
}) => {
  const handleClick = (event: any) => {
    event.preventDefault();
    isReadFullMessages.current = false;
    setTimeout(() => {
      isReadFullMessages.current = true;
    }, 1000);
    chatStore.unsubscribeElements && chatStore.unsubscribeElements();
    // console.log("LLLLLLLLLLLLLLLLL", chatStore.dataMessagesId?.lastMessageId);
    sendNextPrevMessagesServer({
      name: chatStore.params.name,
      room: chatStore.params.room,
      startID: chatStore.dataMessagesId?.lastMessageId || 1,
      limit: 50,
    });
    sendStartNum({
      name: chatStore.params.name,
      room: chatStore.params.room,
      startID: chatStore.dataMessagesId?.lastMessageId || 1,
    });
  };

  return (
    <div className={styles.infoNewMessage}>
      You have {chatStore.dataMessagesId?.unreadMessagesCount} new{" "}
      {chatStore.dataMessagesId?.unreadMessagesCount === 1
        ? "message"
        : "messages"}
      <button onClick={handleClick}>
        <LiaArrowCircleDownSolid
          style={{ fontSize: "40px", color: "rgb(244, 238, 238)" }}
        />
      </button>
    </div>
  );
};

export default observer(InfoNewMessage);
