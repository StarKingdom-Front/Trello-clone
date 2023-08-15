import React from "react";
import { IBoards } from "../../interface/interface";

import styles from "./BoardSprintPage.module.css";
import { Link } from "react-router-dom";

const BoardSprintPage: React.FC<IBoards> = ({ id, title, desc }) => {
  return (
    <Link to={`/spirntBoard/${id}`}>
      <div className={styles.body}>
        <h3>{title}</h3>
        <div className={styles.text}>
          <p>{desc}</p>
        </div>
      </div>
    </Link>
  );
};

export default BoardSprintPage;
