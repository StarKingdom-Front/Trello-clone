import axios from "axios";
import { IBoards } from "../interface/Boards.interface";

export const services = {
  async getAll() {
    const response = await axios.get<IBoards[]>(
      `https://trello-board-8e7cf-default-rtdb.firebaseio.com/pages.json`
    );

    return Object.values(response.data);
  },

  async getById(id: string) {
    const response = await axios.get<IBoards[]>(
      `https://trello-board-8e7cf-default-rtdb.firebaseio.com/pages.json?orderBy="id"&equalTo=${id}`
    );
    return Object.values(response.data)[0];
  },
};