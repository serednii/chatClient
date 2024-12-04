import infoStore from "../mobx/infoStore";
import styles from "./info.module.scss";
import { FaArrowAltCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import chatStore from "../mobx/chatStore";

const Info = () => {
  const [id, setId] = useState<string | null>(null);

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
  const start: number = clearState[0]?.id;
  const end: number = clearState.at(-1)?.id || 0;
  const fullMessages: number = start && end && end - start;
  const fullMessagesRef = chatStore.arrayLastUserRef.length;
  const arrayRefId: (string | undefined | null)[] =
    chatStore.arrayLastUserRef.map((e) => e?.getAttribute("data-id"));

  return (
    <div className={styles.info}>
      <FaArrowAltCircleUp color={infoStore.isUp ? "red" : "black"} size={30} />
      <br />
      <FaArrowCircleDown color={infoStore.isDown ? "red" : "black"} size={30} />
      <div key="id" style={{ fontSize: "20px", color: "red" }}>
        {id}
      </div>
      <div key="start">
        {start} -- {end}
      </div>
      <div key="fullMessages">{fullMessages}</div>
      <div key="fullMessagesRef">{fullMessagesRef}</div>
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
