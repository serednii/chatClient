import { MutableRefObject } from "react";

export interface MessageProps {
  id: number;
  lastUserRef: MutableRefObject<HTMLDivElement | null> | null;
  MyClassName: string;
  author: string;
  message: string;
  date: string;
  itsMe: boolean;
  setBlockLastUserRef: (value: boolean) => void;
  deleteMessageById: (id: number) => void;
  updateMessageById: (id: number, message: string) => void;
}

export interface IData {
  dataIdStr: string;
  dataMessage: string;
}
