import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/authResponse";

export default class UserService {

   static fetchUsers():Promise<AxiosResponse<IUser[]>>{
    return $api.get<IUser[]>('/users')
   }

   static async updateUser(user: IUser): Promise<AxiosResponse<AuthResponse>> {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("userName", user.userName);
      console.log("lastUserName", user.lastUserName);
      console.log("isBlocked", user.isBlocked);
      console.log("isAddedContent", user.isAddedContent);
      console.log("users", user.roles);
      console.log("user email", user.email);
      console.log("user id", user._id);
      console.log("user isActivated", user.isActivated);
      console.log("++++++++++++++++++++++++++++++++");
      return $api.post<AuthResponse>('/update', {user});
    }

    static async createUser(email: string, password: string, userName: string, lastUserName: string): Promise<AxiosResponse<AuthResponse>> {
      
      console.log("++++++++++++++++++++++++++++++++");
      console.log("userName", userName);
      console.log("lastUserName", lastUserName);
      console.log("password", password);
      console.log("user email", email);
      console.log("++++++++++++++++++++++++++++++++");

      return $api.post<AuthResponse>('/create', {email, password, userName, lastUserName});
    }
  
    static async deleteUser(id: string){
      console.log("++++++++++++++++++++++++++++++++");
      console.log("id",id);
      console.log("++++++++++++++++++++++++++++++++");
      return $api.post<AuthResponse>('/delete', {id});
    }

}