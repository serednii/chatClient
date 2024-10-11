import { makeAutoObservable } from "mobx";
import graphQLArticleController from "../../controller/graphQL/graphql-ArticleController";

class ArticleStore {

  constructor() {
    makeAutoObservable(this);
  }


  async getArticle(id: string) {
    try {
      const response = await graphQLArticleController.getDataArticle(id);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addArticle(article: string) {
    try {
      const response = await graphQLArticleController.addDataArticle(article);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateArticle(id: string, article: string) {
    try {
      const response = await graphQLArticleController.updateDataArticle(id, article);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteArticle(id: string) {
    try {
      const response = await graphQLArticleController.deleteDataArticle(id);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const articleStore = new ArticleStore();
export default articleStore;
