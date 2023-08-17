import { AnyAction } from "@reduxjs/toolkit";

export interface IBoards {
  id: number;
  title: string;
  desc?: string;
  deleteBoard?: (id: string | number) => void
}

export interface IModel {
  id: string;
  text: string;
  isFinished: boolean;
  createdAt?: string;
  updatedAt?: string;
  isTextShowed?: boolean;
}

export type TActionSlice = Omit<IModel, "text">;
export type TUpdateTextShowed = Omit<TActionSlice, "isFinished">;

export interface IColumnLayoutProps {
  labelText?: string;
  addHandler: (v: string) => AnyAction;
  removeHandler: (v: string) => AnyAction;
  completedHandler: (v: TActionSlice) => AnyAction;
  selectorState: IModel[];
  droppableId: string;
  updateTextShowed: (v: TUpdateTextShowed) => AnyAction;
}

export interface IColumn {
  id: string | number;
  title: string;
  now: any
}

export interface ITask {
  id: string | number;
  columnId: string | number;
  content: string;
}
