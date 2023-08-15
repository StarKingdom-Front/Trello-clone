import React, { useMemo, useState } from "react";

import styles from "./Column.module.css";
import { IColumn, ITask } from "../../../interface/interface";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "../TaskCard/TaskCard";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface IProps {
  columns: IColumn;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;

  createTask: (columnIdL: string | number) => void;
  tasks: ITask[];
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
}

const Column = (props: IProps) => {
  const {
    columns,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columns.id,
    data: {
      type: "Columns",
      columns,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className={styles.body__drag}></div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.body}>
      <div
        {...attributes}
        {...listeners}
        className={styles.body__up}
        onClick={() => {
          setEditMode(true);
        }}
      >
        <div>
          {!editMode && columns.title}
          {editMode && (
            <input
              value={columns.title}
              onChange={(e) => updateColumn(columns.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <Button
          variant="outlined"
          onClick={() => {
            deleteColumn(columns.id);
          }}
        >
          <DeleteIcon />
        </Button>
      </div>
      <div style={{ display: "flex", flexGrow: "inherit", flexDirection: 'column', gap: '10px'}}>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <div style={{ marginTop: "50px" }}>
        <Button
          variant="outlined"
          onClick={() => {
            createTask(columns.id);
          }}
        >
          <AddIcon /> Add Task
        </Button>
      </div>
    </div>
  );
};

export default Column;
