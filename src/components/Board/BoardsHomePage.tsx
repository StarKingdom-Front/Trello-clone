import React from "react";
import { IBoards } from "../../interface/Boards.interface";

import styles from "./BoardsHomePage.module.css";
import { Link } from "react-router-dom";

const BoardsHomePage: React.FC<IBoards> = ({ id, title, desc }) => {
  return (
    <Link to={`/pages/${id}`}>
      <div className={styles.body}>
        <h3>{title}</h3>
        <div className={styles.text}>
          <p>{desc}</p>
        </div>
      </div>
    </Link>
  );
};

export default BoardsHomePage;
