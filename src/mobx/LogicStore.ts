import { makeAutoObservable, action } from "mobx";

class LogicStore {
  idArticle: string;
  isChangeLinks: boolean;
  isModal: boolean;
  isAddCategoryOther: boolean;
  isLoading: boolean;
  isLoadingMenu: boolean;
  isButtonPlus: boolean;
  isOpenAddCategory: boolean;
  error: string;
  info: string;
  updateListLink: boolean; //
  updateDataMain: boolean; //

  constructor() {
    makeAutoObservable(this, {
      setIdArticle: action,
      setChangeLinks: action,
      toggleChangeLinks: action,
      setModal: action,
      setAddCategoryOther: action,
      setLoading: action,
      setLoadingMenu: action,
      setButtonPlus: action,
      setOpenAddCategory: action,
      setError: action,
      setInfo: action,
      toggleUpdateListLink: action,
      toggleUpdateDataMain: action,
    });

    this.idArticle = "";
    this.isChangeLinks = false;
    this.isModal = false;
    this.isAddCategoryOther = false;
    this.isLoading = false;
    this.isLoadingMenu = false;
    this.isButtonPlus = false;
    this.isOpenAddCategory = false;
    this.updateListLink = false;
    this.updateDataMain = false;
    this.error = "";
    this.info = "";
  }

  setIdArticle(idArticle: string) {
    this.idArticle = idArticle;
  }
  setChangeLinks(value: boolean) {
    this.isChangeLinks = value;
  }
  toggleChangeLinks() {
    this.isChangeLinks = !this.isChangeLinks;
  }
  setModal(value: boolean) {
    this.isModal = value;
  }
  setAddCategoryOther(value: boolean) {
    this.isAddCategoryOther = value;
  }
  setLoading(value: boolean) {
    this.isLoading = value;
  }
  setLoadingMenu(value: boolean) {
    this.isLoadingMenu = value;
  }
  setButtonPlus(value: boolean) {
    this.isButtonPlus = value;
  }
  setOpenAddCategory(value: boolean) {
    this.isOpenAddCategory = value;
  }
  setError(value: string) {
    this.error = value;
  }
  setInfo(value: string) {
    this.info = value;
  }
  toggleUpdateListLink() {
    this.updateListLink = !this.updateListLink;
  }
  toggleUpdateDataMain() {
    this.updateDataMain = !this.updateDataMain;
  }
}

const logicStore = new LogicStore();
export default logicStore;
