import infoStore from "../mobx/infoStore";
import styles from "./info.module.scss";
import { FaArrowAltCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import chatStore from "../mobx/chatStore";
import { getNextUserId } from "../components/Util";
import {
  sendNextMessagesServer,
  sendNextPrevMessagesServer,
} from "../components/socket/setDataSocket";

const Info = () => {
  const [id, setId] = useState<string | null>(null);
  const [start, setStart] = useState<any>(0);
  const [limit, setLimit] = useState<any>(50);

  useEffect(() => {
    const el = infoStore.idActive;
    setId(el ? el.getAttribute("data-id") : null);

    const t = setTimeout(() => infoStore.setUp(false), 1000);
    return () => clearTimeout(t);
  }, [infoStore.isUp]);

  useEffect(() => {
    const t = setTimeout(() => infoStore.setDown(false), 1000);
    return () => clearTimeout(t);
  }, [infoStore.isDown]);

  const state = [...chatStore.state];
  const clearState = state.filter((e) => e?.author !== "Admin");
  //   const start: number = clearState[0]?.id;
  //   const end: number = clearState.at(-1)?.id || 0;
  //   const fullMessages: number = start && end && end - start;
  const fullMessagesRef = chatStore.arrayLastUserRef.length;
  const arrayRefId: (string | undefined | null)[] =
    chatStore.arrayLastUserRef.map((e) => e?.getAttribute("data-id"));

  const handleSend = (event: any) => {
    event.preventDefault();
    sendNextMessagesServer({
      name: chatStore.params.name,
      room: chatStore.params.room,
      startID: parseInt(start),
      limit: parseInt(limit),
    });
  };

  return (
    <div className={styles.info}>
      <div>
        <p>Limit</p>
        <input
          value={limit}
          type="number"
          style={{ backgroundColor: "white", color: "black" }}
          onChange={(e) => setLimit(e.target.value)}
        />
      </div>

      <div>
        <p>Start Id</p>
        <input
          value={start}
          type="number"
          style={{ backgroundColor: "white", color: "black" }}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div>
        <p>Send</p>
        <button
          style={{ backgroundColor: "white", color: "black", padding: "10px" }}
          onClick={handleSend}
          type="submit"
        >
          send
        </button>
      </div>

      <FaArrowAltCircleUp color={infoStore.isUp ? "red" : "black"} size={30} />
      <br />
      <FaArrowCircleDown color={infoStore.isDown ? "red" : "black"} size={30} />
      <div key="id" style={{ fontSize: "20px", color: "red" }}>
        {id}
      </div>
      <div>viewMessageId {chatStore.dataMessagesId?.viewMessageId}</div>
      <div>lastMessageId {chatStore.dataMessagesId?.lastMessageId}</div>
      <div>firstMessageId {chatStore.dataMessagesId?.firstMessageId}</div>
      <div>
        unreadMessagesCount {chatStore.dataMessagesId?.unreadMessagesCount || 0}
      </div>

      <div key="fullMessages">fullMessages {clearState.length}</div>
      <div key="fullMessagesRef">fullMessagesRef {fullMessagesRef}</div>
      {arrayRefId &&
        arrayRefId.map((e) => (
          <div
            style={{ backgroundColor: "yellow", marginBottom: "2px" }}
            key={e}
          >
            {e}
          </div>
        ))}
    </div>
  );
};

export default observer(Info);
