import { observer } from "mobx-react-lite";
import chatStore from "../../../mobx/chatStore";
import { sendNextMessagesServer } from "../../socket/setDataSocket";
import "./ReadFullMessages.scss";

function ReadFullMessages() {
  const handleClick = (event: any) => {
    event.preventDefault();
    chatStore.setState([]);
    chatStore.setArrayLastUserRef([]);
    sendNextMessagesServer({
      name: chatStore.params.name,
      room: chatStore.params.room,
      startID: (chatStore.dataMessagesId?.lastMessageId || 0) - 50,
      limit: 50,
    });
  };

  return (
    <div className="btn btn-danger ReadFullMessages">
      <button onClick={handleClick}>Пропустити всі повідомлення</button>
    </div>
  );
}

export default observer(ReadFullMessages);
