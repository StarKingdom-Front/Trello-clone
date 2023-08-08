import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IBoards } from "../../interface/Boards.interface";
import { services } from "../../services/services";
import Loading from "../../layout/Loading";

export default function Sprint() {
    const { id } = useParams();
    const [board, setBoard] = useState<IBoards | null>(null);
  
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


  return (
    <div className="_container-sprint">
        <div>
            <h2>{board.title}</h2>
            <p><span style={{fontWeight: '700'}}>Description:</span> {board.desc}</p>
        </div>
    </div>
  );
}
