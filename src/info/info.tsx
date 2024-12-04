import infoStore from "../mobx/infoStore";
import styles from "./info.module.scss";
import { FaArrowAltCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import chatStore from "../mobx/chatStore";
const Info = () => {
  const el = infoStore.idActive;
  const id = el && el.getAttribute("data-id");

  useEffect(() => {
    const t = setTimeout(() => infoStore.setUp(false), 1000);
    return () => clearTimeout(t);
  }, [infoStore.isUp]);

  useEffect(() => {
    const t = setTimeout(() => infoStore.setDown(false), 1000);
    return () => clearTimeout(t);
  }, [infoStore.isDown]);

  const state = [...chatStore.state];
  const clearState = state.filter((e) => e?.author !== "Admin");
  const start = clearState[0]?.id;
  const end = clearState.at(-1)?.id;
  const arrayRefId: (string | undefined | null)[] =
    chatStore.arrayLastUserRef.map((e) => e?.getAttribute("data-id"));

  return (
    <div className={styles.info}>
      <FaArrowAltCircleUp color={infoStore.isUp ? "red" : "black"} size={30} />
      <br />
      <FaArrowCircleDown color={infoStore.isDown ? "red" : "black"} size={30} />
      <div style={{ fontSize: "20px", color: "red" }}>{id}</div>
      <div>
        {start} -- {end}
      </div>
      {arrayRefId &&
        arrayRefId.map((e) => {
          return <div>{e}</div>;
        })}
    </div>
  );
};

export default observer(Info);
