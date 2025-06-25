const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'O texto da tarefa é obrigatório'],
    trim: true,
    minlength: [3, 'A tarefa deve ter pelo menos 3 caracteres'],
    maxlength: [500, 'A tarefa não pode ter mais de 500 caracteres']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['baixa', 'média', 'alta'],
    default: 'média'
  },
  category: {
    type: String,
    enum: ['geral', 'trabalho', 'estudo', 'pessoal', 'saúde', 'lazer'],
    default: 'geral'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para melhor performance
taskSchema.index({ completed: 1, createdAt: -1 });
taskSchema.index({ priority: 1, category: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual para calcular a idade da tarefa
taskSchema.virtual('age').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Hoje';
  if (diffDays === 2) return 'Ontem';
  if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
  
  return created.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });
});

// Middleware para atualizar completedAt quando a tarefa for marcada como concluída
taskSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed) {
    this.completedAt = new Date();
  } else if (this.isModified('completed') && !this.completed) {
    this.completedAt = null;
  }
  next();
});

// Método estático para obter estatísticas
taskSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        pending: { $sum: { $cond: ['$completed', 0, 1] } }
      }
    }
  ]);
  
  return stats[0] || { total: 0, completed: 0, pending: 0 };
};

// Método estático para obter tarefas por categoria
taskSchema.statics.getByCategory = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Task', taskSchema); 