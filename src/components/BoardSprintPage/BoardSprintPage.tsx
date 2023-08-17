import React from "react";
import { IBoards } from "../../interface/interface";

import styles from "./BoardSprintPage.module.css";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  sprints: IBoards;
  deleteSprint: (idBoards: number, idSprint: number) => void;
  idPage: any;
}

const BoardSprintPage = (props: IProps) => {
  const { sprints, deleteSprint, idPage } = props;
  return (
    <div className={styles.body}>
      <Link to={`/pages/${idPage}/sprint/${sprints.id}`}>
          <h3>{sprints.title}</h3>
          <div className={styles.text}>
            <p>{sprints.desc}</p>
          </div>
      </Link>
      <div className={styles.btn}
          onClick={() => {
            deleteSprint(idPage, sprints.id);
          }}
        >
          <DeleteIcon />
        </div>
    </div>
  );
};

export default BoardSprintPage;
