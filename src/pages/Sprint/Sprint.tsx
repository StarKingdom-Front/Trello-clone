import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IBoards } from "../../interface/interface";
import Loading from "../../layout/Loading";
import CreateModalBoard from "../../components/CreateModalBoard/CreateModalBoard";
import styles from './Sprint.module.css'
import BoardSprintPage from "../../components/BoardSprintPage/BoardSprintPage";
import { onValue, ref, remove } from "firebase/database";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';



export default function Sprint() {
  const { id } = useParams();
  const [board, setBoard] = useState<IBoards | null>(null);
  const { t } = useTranslation();

  const [sprints, setSprints] = useState<IBoards[]>([]);
  const [searchSprint, setSearchSprint] = useState("");


  useEffect(() => {
    const starCountRef = ref(db, "pages/" + id);
    onValue(starCountRef, (snapshot) => {
      setSprints([])
      const datas = snapshot.val();
      const testSprint = datas.sprint
      if(testSprint == null || testSprint == undefined) {
        return
      }
     
      if (datas !== null) {
        Object.values(datas.sprint).map((board: any) => {
          console.log({board})
          setSprints((oldArray : any) => [...oldArray, board]);
        });
      } else if(datas == null){
        console.log('error')
      }
    });

    if (!id) return;
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setBoard(data);
    });
  }, [id]);

  if (!board) return <Loading />;


   //delete
   const handleDeleteFirebase = (idBoards: number, idSprint: number) => {
    remove(ref(db, `/pages/${idBoards}/sprint/${idSprint}`));
  };

  const filterSprint = sprints.filter((board) => {
    return board.title.toLowerCase().includes(searchSprint.toLowerCase());
  });

  const SprintHome = filterSprint.map((board) => (
    <BoardSprintPage sprints={board} idPage={id} key={board.id} deleteSprint={handleDeleteFirebase} {...board} />
  ));

  return (
    <div className="_container-sprint">
      <div>
        <h1>{t("Sprints")}</h1>
        <h2>{board.title}</h2>
        <p>
          <span style={{ fontWeight: "700" }}>{t("Description")}</span> {board.desc}
        </p>
        <div className={styles.body__filter}>
          <input
            className={styles.filter}
            type="search"
            value={searchSprint}
            onChange={(e) => setSearchSprint(e.target.value)}
            placeholder={t("Enter search board")}
          />
        </div>
        <div className={styles.boards__body}>
          {sprints.length ? SprintHome : null}
          <CreateModalBoard setSprints={setSprints} board={board}/>
        </div>
      </div>
    </div>
  );
}
