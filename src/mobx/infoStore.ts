import { action, makeAutoObservable, observable } from "mobx";


class InfoStore {
  idActive: HTMLLIElement | null;
  isUp: boolean;
  isDown: boolean;

  constructor() {
    makeAutoObservable(this);
    this.idActive = null;
    this.isUp = false;
    this.isDown = false;
  }

  setIdActive(value: HTMLLIElement | null) {
    this.idActive = value;
  }

  setUp(v: boolean) {
    this.isUp = v;
  }

  setDown(v: boolean) {
    this.isDown = v;
  }
}

const infoStore = new InfoStore();
export default infoStore;
