import { AxiosError } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import UserService from "../services/UserService";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/authResponse";
import { URL_AUTH } from "../../const";
import AuthService from "../services/AuthServices"; // Додайте цей імпорт
// import menuStore from "../../mobx/asyncDataStore/AsyncMenuStore";
import dataStore from "../../mobx/DataStore";
import logicStore from "../../mobx/LogicStore";

class AuthStore {
  user: IUser = {} as IUser;
  isAuth: boolean = false;
  isLoading: boolean = false;
  users: IUser[] = []; // Виправлено ініціалізацію масиву

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  setUsers(users: IUser[]) {
    this.users = users;
  }

  async getUsers() {
    // Виправлено метод
    console.log("getUsers");

    try {
      const response = await UserService.fetchUsers();
      runInAction(() => {
        this.users = response?.data;
      });
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message);
      logicStore.setError(error.response?.data?.message || "Error getUsers");
    }
  }

  async login(email: string, password: string) {
    console.log("login");
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response?.data?.accessToken);
      this.setAuth(true);
      this.setUser(response?.data?.user);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error?.response?.data?.message);
      logicStore.setError(error.response?.data?.message || "Error login");
    }
  }

  async registration(
    email: string,
    password: string,
    userName: string,
    lastUserName: string
  ) {
    console.log("registration");
    try {
      const response = await AuthService.registration(
        email,
        password,
        userName,
        lastUserName
      );
      console.log("response auth store", response?.data?.user);
      localStorage.setItem("token", response?.data?.accessToken);
      const idUser = response?.data?.user?.id;
      // console.log(idUser)
      // await menuStore.createMenu(idUser);
      this.setAuth(true);
      this.setUser(response?.data?.user);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error?.response?.data?.message);
      logicStore.setError(
        error.response?.data?.message || "Error registration"
      );
    }
  }

  async updateUser(user: IUser) {
    console.log("updateUser");
    try {
      await UserService.updateUser(user);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message);
    }
  }

  async logout() {
    console.log("logout");
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({} as IUser);
      dataStore.clearStore();
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error?.response?.data?.message);
      logicStore.setError(error?.response?.data?.message || "Error logout");
    }
  }

  async createUser(
    email: string,
    password: string,
    userName: string,
    lastUserName: string
  ) {
    console.log("updateUser");
    try {
      const response = await UserService.createUser(
        email,
        password,
        userName,
        lastUserName
      );
      // console.log('response auth store', response)
      const idUser = response?.data?.user?._id;
      // console.log(idUser)
      // await menuStore.createMenu(idUser);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message);
    }
  }

  async deleteUser(id: string) {
    console.log("deleteUser", id);

    try {
      await UserService.deleteUser(id);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message);
    }
  }

  async checkAuth() {
    console.log("checkAuth");

    this.setLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${URL_AUTH}/refresh`, {
        withCredentials: true,
      });
      this.setAuth(true);
      this.setUser(response?.data?.user);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log(error?.response?.data?.message);
      // store.dispatch(setError(error?.response?.data?.message || "Error checkAuth"));
    } finally {
      this.setLoading(false);
    }
  }
}

const authStore = new AuthStore();
export default authStore;
