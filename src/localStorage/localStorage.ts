const addLastIdMessageViewLocalStorage = (lastId: number | undefined) => {
  localStorage.setItem("lastIdMessage", JSON.stringify(lastId));
};

const getLastIdMessageViewLocalStorage = () => {
  const res = localStorage.getItem("lastIdMessage");
  if (res) {
    return JSON.parse(res);
  }
  return;
};

export { addLastIdMessageViewLocalStorage, getLastIdMessageViewLocalStorage };
