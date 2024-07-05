import { Request, Response } from "express";
import { Todo } from "../modal/todo";
import { User } from "../modal/users";

export const getTodos = async (req: Request, res: Response) => {
  const { userId } = req.query;

  try {
    const todos = await Todo.find({ userId, status: false });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
};

export const addTodo = async (req: Request, res: Response) => {
  const { text, userId } = req.body;

  const newTodo = new Todo({
    text,
    userId,
    status: false,
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error adding todo", error });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, status, completedOn } = req.body;
//   console.log("updateTodo", req.body);

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, status, completedOn },
      { new: true }
    );
    // console.log("updateTodo", updatedTodo);

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo", error });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
//   console.log("deleteTodo", req.params);
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);

    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
};

export const completedtodos = async (req: Request, res: Response) => {
  const { userId } = req.query;
//   console.log("completedtodos", req.query);

  try {
    const completedTodos = await Todo.find({ userId, status: true });
    // console.log("req.completedTodos", completedTodos);

    res.status(200).json(completedTodos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching completed todos", error });
  }
};
export const deletecompletedtodos = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);

    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
};

export const postcompletedtodos = async (req: Request, res: Response) => {
  const { _id } = req.body;

  try {
    const updatedToDo = await Todo.findByIdAndUpdate(
      _id,
      { status: true, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedToDo) {
      return res.status(404).json({ error: "To-do item not found" });
    }

    res.status(200).json(updatedToDo);
  } catch (error) {
    console.error("Error updating to-do item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
