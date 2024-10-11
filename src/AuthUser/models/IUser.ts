export interface IUser {
    userName: string,
    lastUserName: string,
    email: string;
    isActivated: boolean;
    id: string;
    _id: string;
    roles: string[];
    isAddedContent:boolean;
    isBlocked:boolean;
    isMutation: boolean;
    password: string;
}