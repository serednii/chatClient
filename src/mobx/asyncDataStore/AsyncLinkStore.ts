
import { makeAutoObservable} from "mobx";
import graphQLLinkController from "../../controller/graphQL/graphql-LinkController";

class LinkStore {

  constructor() {
    makeAutoObservable(this);
  }

  async getLink(id: string) {
    try {
      const response = await graphQLLinkController.getDataLink(id);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addLink(link: string) {
    try {
      const response = await graphQLLinkController.addDataLink(link);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateLink(id: string, link: string) {
    try {
      const response = await graphQLLinkController.updateDataLink(id, link);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteLink(id: string) {
    try {
      const response = await graphQLLinkController.deleteDataLink(id);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}

const linkStore = new LinkStore();
export default linkStore;
