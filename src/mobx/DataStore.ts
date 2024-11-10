import { makeAutoObservable, action } from "mobx";

class DataStore {
  dataMain: any;
  listLinkData: any;
  sluice: any;
  breadcrumbs: string[];

  constructor() {
    makeAutoObservable(this, {
      setDataMain: action,
      setListLinkData: action,
      setSluice: action,
      setBreadcrumbs: action,
    });

    this.breadcrumbs = [];
  }

  setDataMain(dataMain: any) {
    this.dataMain = dataMain;
  }

  setListLinkData(listLinkData: any) {
    this.listLinkData = listLinkData;
  }

  setSluice(sluice: any) {
    this.sluice = sluice;
  }

  setBreadcrumbs(breadcrumbs: string[]) {
    this.breadcrumbs = breadcrumbs;
  }

  clearStore() {
    this.dataMain = {};
    this.listLinkData = {};
    this.sluice = [];
    this.breadcrumbs = [];
  }
}

const dataStore = new DataStore();
export default dataStore;
