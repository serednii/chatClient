import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import chatStore from "../mobx/chatStore";
import { sendStartNum } from "../components/socket/setDataSocket";

import styles from "./setNum.module.scss";

const Info = () => {
  const [start, setStart] = useState<any>(0);

  const handleSend = (event: any) => {
    event.preventDefault();
    sendStartNum({
      name: chatStore.params.name,
      room: chatStore.params.room,
      startID: parseInt(start),
    });
  };

  useEffect(() => {
    if (chatStore.dataMessagesId) {
      setStart(chatStore.dataMessagesId.viewMessageId);
    }
  }, [chatStore.dataMessagesId]);

  return (
    <div className={styles.info}>
      <div>
        <input
          value={start}
          type="number"
          style={{ backgroundColor: "white", color: "black" }}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div>
        <button
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "2px 5px",
          }}
          onClick={handleSend}
          type="submit"
        >
          send
        </button>
      </div>
    </div>
  );
};

export default observer(Info);
