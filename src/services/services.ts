import axios from "axios";
import { IBoards } from "../interface/interface";

export const services = {
  async getAll() {
    const response = await axios.get<IBoards[]>(
      `https://trello-board-8e7cf-default-rtdb.firebaseio.com/pages.json`
    );
      console.log({response})
    return Object.values(response.data);
  },

  async getById(id: string) {
    const response = await axios.get<IBoards[]>(
      `https://trello-board-8e7cf-default-rtdb.firebaseio.com/pages.json?orderBy="id"&equalTo=${id}`
    );
    return Object.values(response.data)[0];
  },

  // async getSprintById(pageId: string, sprintId: string) {
  //   const response = await axios.get<IBoards[]>(
  //     `https://trello-board-8e7cf-default-rtdb.firebaseio.com/pages.json?orderBy="id"&equalTo=${id}/sprint/:id`
  //   );
  //   return Object.values(response.data)[0];
  // },
};
