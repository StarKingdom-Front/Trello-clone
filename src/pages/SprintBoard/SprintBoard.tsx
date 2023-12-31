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
import { useTranslation } from "react-i18next";

const defaultCols: IColumn[] = [
  {
    id: "todo",
    title: "Todo",
    now: '-'
  },
  {
    id: "doing",
    title: "Work in progress",
    now: '-'
  },
  {
    id: "done",
    title: "Done",
    now: '-'
  },
];

const SprintBoard = () => {
  const [columns, setColumns] = useState<IColumn[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const [tasks, setTasks] = useState<ITask[]>([]);
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function createNewColumn() {
    const today = new Date();

    const now = today.toLocaleTimeString("en-US");
    console.log(now);
    const columnToAdd: IColumn = {
      id: generateId(),
      title: `Click update, Column ${columns.length + 1}`,
      now: now,
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
      content: `Click update, Task ${tasks.length + 1}`,
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
                  {t("Add Column")}
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
