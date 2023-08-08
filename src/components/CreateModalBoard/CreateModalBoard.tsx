import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import styles from "./CreateModalBoard.module.css";
import { IBoards } from "../../interface/Boards.interface";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#586572",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ICreateBord {
  setBoard: React.Dispatch<React.SetStateAction<IBoards[]>>;
}

interface IcreateForm {
  title: string;
  desc: string;
}

export default function BasicModal({ setBoard }: ICreateBord) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IcreateForm>({
    mode: "onBlur",
  });

  const [userData, setUserData] = useState({
    title: "",
    id: "",
    desc: "",
  });

  let name, value;
  const postUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    name = event.target.name;
    value = event.target.value;

    setUserData({ ...userData, [name]: value });
  };

  //connect with firebase
  const submitData = async (event: any) => {
    if (isValid) {
      event.preventDefault();
      const { title, desc, id } = userData;
      const res = axios
        .post(
          "https://trello-board-8e7cf-default-rtdb.firebaseio.com/pages.json",
          {
            desc,
            title,
            id: Number(`${Math.floor(Math.random() * 100) + 1}`),
          }
        )
        .then(function (response) {
          console.log({ response });
          const data = response.data.name;
          console.log(data);
          let test = setBoard((prev: any) => [
            ...prev,
            { ...userData, id: response.data.name },
          ]);
          console.log({ test });
        });
      handleClose();
    } else {
      console.log("error");
    }
  };

  const submit: SubmitHandler<IcreateForm> = (data) => {
    reset();
  };

  return (
    <div>
      <Button className={styles.btn} onClick={handleOpen}>
        Create New Board
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className={styles.modal__body}>
          <form
            className={styles.form__body}
            onSubmit={handleSubmit(submit)}
            method="POST"
          >
            <TextField
              sx={{
                "& > :not(style)": { color: "#fff", opacity: 0.9 },
              }}
              {...register("title", {
                required: true,
                maxLength: {
                  value: 20,
                  message: "Максимум 20 символов!",
                },
                minLength: {
                  value: 5,
                  message: "Минимум 5 символов!",
                },
              })}
              id="standard-basic"
              label="Name"
              name="title"
              variant="standard"
              onChange={postUserData}
              value={userData.title}
            />
            {errors?.title && (
              <span style={{ color: "red" }}>
                {errors?.title.message || "Название не заполнено!"}
              </span>
            )}

            <TextField
              sx={{
                "& > :not(style)": { color: "#fff", opacity: 0.9 },
              }}
              {...register("desc", {
                required: true,
                maxLength: {
                  value: 20,
                  message: "Максимум 20 символов!",
                },
                minLength: {
                  value: 5,
                  message: "Минимум 5 символов!",
                },
              })}
              id="standard-basic"
              label="Desc"
              name="desc"
              variant="standard"
              onChange={postUserData}
              value={userData.desc}
            />
            {errors?.desc && (
              <span style={{ color: "red" }}>
                {errors?.desc.message || "Название не заполнено!"}
              </span>
            )}
            <Button className="btn" onClick={submitData} variant="contained">Create Board</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
