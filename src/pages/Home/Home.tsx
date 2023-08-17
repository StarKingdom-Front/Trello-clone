import React, { useEffect, useState } from "react";
import { services } from "../../services/services";
import { IBoards } from "../../interface/interface";
import BoardsHomePage from "../../components/Board/BoardsHomePage";

import styles from "./Home.module.css";
import CreateModalBoard from "../../components/CreateModalBoard/CreateModalBoard";
import { useTranslation } from "react-i18next";
import {  db } from "../../firebase";
import { onValue, ref, remove } from "firebase/database";
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
  const [boards, setBoards] = useState<IBoards[]>([]);

  const [search, setSearch] = useState("");

  const { t } = useTranslation();

  useEffect(() => {

    onValue(ref(db), (snapshot) => {
      setBoards([])
      const data = snapshot.val();
     
      if (data !== null) {
        Object.values(data.pages).map((board) => {
          setBoards((oldArray : any) => [...oldArray, board]);
        });
      }
    });
  }, [setBoards]);

    //delete
    const handleDeleteFirebase = (id: any) => {
      remove(ref(db, `/pages/${id}`));
    };

  const filterBoards = boards.filter((board) => {
    return board.title.toLowerCase().includes(search.toLowerCase());
  });

  const BoardsHome = filterBoards.map((board) => (
    <BoardsHomePage boards={board}  deleteBoard={handleDeleteFirebase} key={board.id} {...board} />
  ));

  

  return (
    <div>
      <div className="_container">
        <h1 style={{ textAlign: "center" }}>{t("All Boards")}</h1>

        <div className={styles.body__filter}>
          <input
            className={styles.filter}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Enter search board")}
          />
        </div>

        <div className={styles.boards__body}>
          {boards.length ? BoardsHome : null}

          <div>
            <CreateModalBoard setBoards={setBoards}/>
          </div>
        </div>
      </div>
    </div>
  );
}
