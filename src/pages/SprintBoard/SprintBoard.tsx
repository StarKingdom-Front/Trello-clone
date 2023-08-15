import React, { useMemo, useState } from "react";
import styles from "./SprintBoard.module.css";
import { IColumn, ITask } from "../../interface/interface";
import Column from "./Column/Column";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard/TaskCard";
import { Button } from "@mui/material";

const defaultCols: IColumn[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const SprintBoard = () => {
  // const [text, setText] = useState("");
  // const dispatch = useAppDispatch();

  // const handleAction = () => {
  //   if (text.trim().length) {
  //     dispatch(addTodo(text));
  //     setText("");
  //   }
  // };

  const [columns, setColumns] = useState<IColumn[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const [tasks, setTasks] = useState<ITask[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  console.log(columns);
  function createNewColumn() {
    const columnToAdd: IColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  function deleteColumn(id: string | number) {
    const filterColumn = columns.filter((col) => col.id != id);
    setColumns(filterColumn);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: string | number, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current?.type === "Columns") {
      setActiveColumn(e.active.data.current.columns);
      return;
    }

    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeColumnId);
        const overIndex = tasks.findIndex((t) => t.id === overColumnId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Columns";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeColumnId);

        tasks[activeIndex].columnId = overColumnId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function createTask(columnId: string | number) {
    const newTask: ITask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: string | number) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: string | number, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  return (
    <div className="_container-sprint">
      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.columns__body}>
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <SortableContext items={columnsId}>
                {columns.map((col: IColumn) => (
                  <Column
                    key={col.id}
                    columns={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </SortableContext>
              <div>
                <Button
                  className={styles.add}
                  onClick={createNewColumn}
                  variant="contained"
                >
                  Add Column
                </Button>
              </div>
              {createPortal(
                <DragOverlay>
                  {activeColumn && (
                    <Column
                      columns={activeColumn}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                      createTask={createTask}
                      tasks={tasks.filter(
                        (task) => task.columnId === activeColumn.id
                      )}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                    />
                  )}
                  {activeTask && (
                    <TaskCard
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                      task={activeTask}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintBoard;
