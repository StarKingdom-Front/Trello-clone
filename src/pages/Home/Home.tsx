import React, { useEffect, useState } from "react";
import { services } from "../../services/services";
import { IBoards } from "../../interface/interface";
import BoardsHomePage from "../../components/Board/BoardsHomePage";

import styles from "./Home.module.css";
import CreateModalBoard from "../../components/CreateModalBoard/CreateModalBoard";

export default function Home() {
  const [boards, setBoards] = useState<IBoards[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await services.getAll();
        setBoards(data);
      } catch (e) {
        console.log("error");
      }
    };

    fetchData();
  }, [setBoards]);

  const filterBoards = boards.filter((board) => {
    return board.title.toLowerCase().includes(search.toLowerCase());
  });

  const BoardsHome = filterBoards.map((board) => (
    <BoardsHomePage key={board.id} {...board} />
  ));

  return (
    <div>
      <div className="_container">
        <h1 style={{ textAlign: "center" }}>All Bords</h1>

        <div className={styles.body__filter}>
          <input
            className={styles.filter}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter search board"
          />
        </div>

        <div className={styles.boards__body}>
          {boards.length ? BoardsHome : <h1>Create new boards</h1>}

          <div>
            <CreateModalBoard setBoards={setBoards} />
          </div>
        </div>
      </div>
    </div>
  );
}
