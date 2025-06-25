const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Middleware para tratamento de erros
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// GET /api/tasks - Obter todas as tarefas
router.get('/', asyncHandler(async (req, res) => {
  const { 
    completed, 
    priority, 
    category, 
    sort = '-createdAt',
    limit = 50,
    page = 1
  } = req.query;

  // Construir filtros
  const filters = {};
  if (completed !== undefined) filters.completed = completed === 'true';
  if (priority) filters.priority = priority;
  if (category) filters.category = category;

  // Paginação
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Buscar tarefas
  const tasks = await Task.find(filters)
    .sort(sort)
    .limit(parseInt(limit))
    .skip(skip)
    .lean();

  // Contar total para paginação
  const total = await Task.countDocuments(filters);

  res.json({
    success: true,
    data: tasks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// GET /api/tasks/stats - Obter estatísticas
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Task.getStats();
  const byCategory = await Task.getByCategory();

  res.json({
    success: true,
    data: {
      ...stats,
      byCategory
    }
  });
}));

// GET /api/tasks/:id - Obter uma tarefa específica
router.get('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarefa não encontrada'
    });
  }

  res.json({
    success: true,
    data: task
  });
}));

// POST /api/tasks - Criar nova tarefa
router.post('/', asyncHandler(async (req, res) => {
  const { text, priority, category } = req.body;

  if (!text || text.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'O texto da tarefa é obrigatório e deve ter pelo menos 3 caracteres'
    });
  }

  const task = new Task({
    text: text.trim(),
    priority: priority || 'média',
    category: category || 'geral'
  });

  await task.save();

  res.status(201).json({
    success: true,
    message: 'Tarefa criada com sucesso',
    data: task
  });
}));

// PUT /api/tasks/:id - Atualizar tarefa
router.put('/:id', asyncHandler(async (req, res) => {
  const { text, completed, priority, category } = req.body;

  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarefa não encontrada'
    });
  }

  // Atualizar campos
  if (text !== undefined) {
    if (text.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'O texto da tarefa deve ter pelo menos 3 caracteres'
      });
    }
    task.text = text.trim();
  }
  
  if (completed !== undefined) task.completed = completed;
  if (priority !== undefined) task.priority = priority;
  if (category !== undefined) task.category = category;

  await task.save();

  res.json({
    success: true,
    message: 'Tarefa atualizada com sucesso',
    data: task
  });
}));

// PATCH /api/tasks/:id/toggle - Alternar status de conclusão
router.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarefa não encontrada'
    });
  }

  task.completed = !task.completed;
  await task.save();

  res.json({
    success: true,
    message: `Tarefa ${task.completed ? 'marcada como concluída' : 'desmarcada'}`,
    data: task
  });
}));

// DELETE /api/tasks/:id - Excluir tarefa
router.delete('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarefa não encontrada'
    });
  }

  res.json({
    success: true,
    message: 'Tarefa excluída com sucesso'
  });
}));

// DELETE /api/tasks - Excluir todas as tarefas (com confirmação)
router.delete('/', asyncHandler(async (req, res) => {
  const { confirm } = req.query;
  
  if (confirm !== 'true') {
    return res.status(400).json({
      success: false,
      message: 'Confirmação necessária para excluir todas as tarefas'
    });
  }

  const result = await Task.deleteMany({});
  
  res.json({
    success: true,
    message: `${result.deletedCount} tarefas excluídas com sucesso`
  });
}));

module.exports = router; 