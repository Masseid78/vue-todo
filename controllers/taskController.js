import Task from '../models/taskModel.js';

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar tarefas' });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar tarefa' });
  }
};

export const createTask = async (req, res) => {
  const { text, priority, category } = req.body;
  if (!text || text.length < 3) {
    return res.status(400).json({ success: false, message: 'O texto da tarefa é obrigatório e deve ter pelo menos 3 caracteres' });
  }
  try {
    const task = await Task.create({ text, priority, category });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao criar tarefa' });
  }
};

export const updateTask = async (req, res) => {
  const { text, completed, priority, category } = req.body;
  try {
    const task = await Task.update(req.params.id, { text, completed, priority, category });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar tarefa' });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const task = await Task.toggle(req.params.id);
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao alternar status da tarefa' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.delete(req.params.id);
    res.json({ success: true, message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao excluir tarefa' });
  }
};

export const deleteAllTasks = async (req, res) => {
  try {
    await Task.deleteAll();
    res.json({ success: true, message: 'Todas as tarefas foram excluídas' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao excluir todas as tarefas' });
  }
}; 