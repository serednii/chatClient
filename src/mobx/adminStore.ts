import { makeAutoObservable } from "mobx";

class AdminStore {
  openAdmin: boolean = false;  

  constructor() {
    makeAutoObservable(this);
  }

  setOpenAdmin(openAdmin: boolean) { 
    this.openAdmin = openAdmin;
  }

}

const adminStore = new AdminStore();
export default adminStore;
