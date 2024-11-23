import { makeAutoObservable, action } from "mobx";
import { Socket } from "socket.io-client";

class ChatStore {
  // idArticle: string;
  isWrite: boolean;
  isDeleteMessage: boolean;
  socket: Socket | null;

  // isModal: boolean;
  // isAddCategoryOther: boolean;
  // isLoading: boolean;
  // isLoadingMenu: boolean;
  // isButtonPlus: boolean;
  // isOpenAddCategory: boolean;
  // error: string;
  // info: string;
  // updateListLink: boolean; //
  // updateDataMain: boolean; //

  constructor() {
    makeAutoObservable(this, {
      setWrite: action,
      setDeleteMessage: action,
      setSocket: action,
      // setChangeLinks: action,
      // toggleChangeLinks: action,
      // setModal: action,
      // setAddCategoryOther: action,
      // setLoading: action,
      // setLoadingMenu: action,
      // setButtonPlus: action,
      // setOpenAddCategory: action,
      // setError: action,
      // setInfo: action,
      // toggleUpdateListLink: action,
      // toggleUpdateDataMain: action,
    });

    this.isWrite = false;
    this.isDeleteMessage = false;
    this.socket = null;
    // this.idArticle = "";
    // this.isChangeLinks = false;
    // this.isModal = false;
    // this.isAddCategoryOther = false;
    // this.isLoading = false;
    // this.isLoadingMenu = false;
    // this.isButtonPlus = false;
    // this.isOpenAddCategory = false;
    // this.updateListLink = false;
    // this.updateDataMain = false;
    // this.error = "";
    // this.info = "";
  }

  // setIdArticle(idArticle: string) {
  //   this.idArticle = idArticle;
  // }

  setWrite(value: boolean) {
    // if (value !== undefined) {
    this.isWrite = value;
    // }
  }
  setDeleteMessage(value: boolean) {
    this.isDeleteMessage = value;
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  // toggleChangeLinks() {
  //   this.isChangeLinks = !this.isChangeLinks;
  // }
  // setModal(value: boolean) {
  //   this.isModal = value;
  // }
  // setAddCategoryOther(value: boolean) {
  //   this.isAddCategoryOther = value;
  // }
  // setLoading(value: boolean) {
  //   this.isLoading = value;
  // }
  // setLoadingMenu(value: boolean) {
  //   this.isLoadingMenu = value;
  // }
  // setButtonPlus(value: boolean) {
  //   this.isButtonPlus = value;
  // }
  // setOpenAddCategory(value: boolean) {
  //   this.isOpenAddCategory = value;
  // }
  // setError(value: string) {
  //   this.error = value;
  // }
  // setInfo(value: string) {
  //   this.info = value;
  // }
  // toggleUpdateListLink() {
  //   this.updateListLink = !this.updateListLink;
  // }
  // toggleUpdateDataMain() {
  //   this.updateDataMain = !this.updateDataMain;
  // }
}

const chatStore = new ChatStore();
export default chatStore;
