import React from "react";
import { IBoards } from "../../interface/interface";

import styles from "./BoardsHomePage.module.css";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  boards: IBoards;
  deleteBoard: (id: any) => void;
}

const BoardsHomePage = (props: IProps) => {
  const { boards, deleteBoard } = props;


  return (
    <>
      <div className={styles.body}>
        <Link to={`/pages/${boards.id}`}>
          <h3>{boards.title}</h3>
          <div className={styles.text}>
            <p>{boards.desc}</p>
          </div>
        </Link>
        <div className={styles.btn}
          onClick={() => {
            deleteBoard(boards.id);
          }}
        >
          <DeleteIcon />
        </div>
      </div>
    </>
  );
};

export default BoardsHomePage;
