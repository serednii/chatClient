import { AxiosResponse } from "axios";
import $api from "../http";
// import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/authResponse";


export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    console.log(email);
    console.log(password);
    return $api.post<AuthResponse>('/login', { email, password });
  }

  static async registration(
    email: string,
    password: string,
    userName: string,
    lastUserName: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/registration', { email, password, userName, lastUserName });
  }

  static async logout(): Promise<void> {
    return $api.post("/logout");
  }
  
}
