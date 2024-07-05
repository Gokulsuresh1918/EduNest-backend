import express from 'express';
import { getTodos, addTodo, updateTodo, deleteTodo,deletecompletedtodos, completedtodos,postcompletedtodos } from '../controller/todoController';

const router = express.Router();

router.get('/todos', getTodos);
router.post('/todos', addTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

router.get('/completedtodos', completedtodos);
router.post('/completedtodos', postcompletedtodos);
router.delete('/completedtodos/:id', deletecompletedtodos);
export default router;
