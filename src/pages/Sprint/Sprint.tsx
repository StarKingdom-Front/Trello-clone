import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IBoards } from "../../interface/interface";
import { services } from "../../services/services";
import Loading from "../../layout/Loading";
import CreateModalBoard from "../../components/CreateModalBoard/CreateModalBoard";
import BoardsHomePage from "../../components/Board/BoardsHomePage";

export default function Sprint() {
  const { id } = useParams();
  const [board, setBoard] = useState<IBoards | null>(null);

  const [sprints, setSprints] = useState<IBoards[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await services.getById(id);
        console.log({ data });
        setBoard(data);
      } catch {
        console.log("error id");
      }
    };

    fetchData();
  }, [id]);

  if (!board) return <Loading />;

  // const filterBoards = sprints.filter((board) => {
  //   return board.title.toLowerCase().includes(search.toLowerCase());
  // });

  const SprintHome = sprints.map((board) => (
    <BoardsHomePage key={board.id} {...board} />
  ));

  return (
    <div className="_container-sprint">
      <div>
        <h2>{board.title}</h2>
        <p>
          <span style={{ fontWeight: "700" }}>Description:</span> {board.desc}
        </p>
        <div>
          {sprints.length ? SprintHome : <h1>Create new boards</h1>}
          <CreateModalBoard setSprints={setSprints}/>
        </div>
      </div>
    </div>
  );
}
