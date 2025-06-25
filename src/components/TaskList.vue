<template>
  <div class="task-list-container">
    <!-- Header da lista -->
    <v-card class="list-header-card" elevation="8">
      <v-card-title class="list-title">
        <v-icon class="mr-3 title-icon">mdi-format-list-checks</v-icon>
        Suas Tarefas
        <v-chip class="ml-3" color="primary" variant="outlined">
          {{ tasks.length }} item{{ tasks.length !== 1 ? 's' : '' }}
        </v-chip>
      </v-card-title>
    </v-card>

    <!-- Lista de tarefas -->
    <div v-if="tasks.length > 0" class="tasks-grid">
      <v-card
        v-for="(task, index) in tasks"
        :key="task.id || index"
        class="task-card"
        :class="{ 'completed': task.completed }"
        elevation="6"
        @click="toggleTask(index)"
      >
        <!-- Header do card -->
        <v-card-title class="task-card-header">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
              <!-- Ícone de prioridade -->
              <v-icon
                :color="getPriorityColor(task.priority)"
                class="mr-3 priority-icon"
                size="20"
              >
                {{ getPriorityIcon(task.priority) }}
              </v-icon>
              
              <!-- Categoria -->
              <v-chip
                :color="getCategoryColor(task.category)"
                variant="outlined"
                size="small"
                class="category-chip"
              >
                <v-icon start size="16">{{ getCategoryIcon(task.category) }}</v-icon>
                {{ getCategoryLabel(task.category) }}
              </v-chip>
            </div>
            
            <!-- Data de criação -->
            <v-chip
              variant="text"
              size="small"
              color="grey"
              class="date-chip"
            >
              {{ formatDate(task.createdAt) }}
            </v-chip>
          </div>
        </v-card-title>

        <!-- Conteúdo do card -->
        <v-card-text class="task-content">
          <div class="task-text-container">
            <v-text-field
              v-if="task.editing"
              v-model="task.text"
              variant="outlined"
              density="compact"
              @keyup.enter="saveTask(index)"
              @blur="saveTask(index)"
              class="edit-input"
              autofocus
            ></v-text-field>
            <p v-else class="task-text" :class="{ 'completed-text': task.completed }">
              {{ task.text }}
            </p>
          </div>
        </v-card-text>

        <!-- Ações do card -->
        <v-card-actions class="task-actions">
          <v-spacer></v-spacer>
          
          <!-- Botão de completar -->
          <v-btn
            icon
            size="small"
            :color="task.completed ? 'success' : 'grey'"
            @click.stop="markAsCompleted(index)"
            class="action-btn"
            :title="task.completed ? 'Desmarcar como concluída' : 'Marcar como concluída'"
          >
            <v-icon>{{ task.completed ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}</v-icon>
          </v-btn>

          <!-- Botão de editar -->
          <v-btn
            icon
            size="small"
            color="primary"
            @click.stop="editTask(index)"
            class="action-btn"
            title="Editar tarefa"
          >
            <v-icon>{{ task.editing ? 'mdi-content-save' : 'mdi-pencil' }}</v-icon>
          </v-btn>

          <!-- Botão de deletar -->
          <v-btn
            icon
            size="small"
            color="error"
            @click.stop="confirmDelete(index)"
            class="action-btn"
            title="Excluir tarefa"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!-- Mensagem quando não há tarefas -->
    <v-card v-else class="empty-state-card" elevation="8">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-format-list-text</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">Nenhuma tarefa ainda</h3>
        <p class="text-body-2 text-grey">Adicione sua primeira tarefa para começar!</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      required: true,
    },
  },
  methods: {
    editTask(index) {
      this.$emit('edit-task', index);
    },
    deleteTask(index) {
      this.$emit('delete-task', index);
    },
    markAsCompleted(index) {
      this.$emit('mark-completed', index);
    },
    toggleTask(index) {
      // Toggle para completar/descompletar ao clicar no card
      this.markAsCompleted(index);
    },
    saveTask(index) {
      this.editTask(index);
    },
    confirmDelete(index) {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        this.deleteTask(index);
      }
    },
    getPriorityColor(priority) {
      const colors = {
        'baixa': 'success',
        'média': 'warning',
        'alta': 'error'
      };
      return colors[priority] || 'grey';
    },
    getPriorityIcon(priority) {
      const icons = {
        'baixa': 'mdi-flag',
        'média': 'mdi-flag-variant',
        'alta': 'mdi-flag-variant'
      };
      return icons[priority] || 'mdi-flag';
    },
    getCategoryColor(category) {
      const colors = {
        'geral': 'blue',
        'trabalho': 'purple',
        'estudo': 'green',
        'pessoal': 'orange',
        'saúde': 'red',
        'lazer': 'pink'
      };
      return colors[category] || 'grey';
    },
    getCategoryIcon(category) {
      const icons = {
        'geral': 'mdi-format-list-bulleted',
        'trabalho': 'mdi-briefcase',
        'estudo': 'mdi-school',
        'pessoal': 'mdi-account',
        'saúde': 'mdi-heart',
        'lazer': 'mdi-gamepad-variant'
      };
      return icons[category] || 'mdi-tag';
    },
    getCategoryLabel(category) {
      const labels = {
        'geral': 'Geral',
        'trabalho': 'Trabalho',
        'estudo': 'Estudo',
        'pessoal': 'Pessoal',
        'saúde': 'Saúde',
        'lazer': 'Lazer'
      };
      return labels[category] || 'Geral';
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Hoje';
      if (diffDays === 2) return 'Ontem';
      if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  },
};
</script>

<style scoped>
.task-list-container {
  animation: fadeInUp 0.8s ease-out;
}

.list-header-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
}

.list-title {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.5rem;
}

.title-icon {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: slideInUp 0.6s ease-out;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.task-card.completed {
  opacity: 0.7;
  background: rgba(76, 175, 80, 0.1) !important;
}

.task-card-header {
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.priority-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.category-chip {
  font-size: 0.75rem;
  font-weight: 500;
}

.date-chip {
  font-size: 0.7rem;
}

.task-content {
  padding: 1rem 1.5rem;
  min-height: 80px;
}

.task-text-container {
  width: 100%;
}

.task-text {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  word-wrap: break-word;
  transition: all 0.3s ease;
}

.task-text.completed-text {
  text-decoration: line-through;
  color: #666;
}

.edit-input {
  font-size: 1rem;
}

.task-actions {
  padding: 0.5rem 1.5rem 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.empty-state-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .tasks-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .task-card-header {
    padding: 0.75rem 1rem 0.25rem 1rem;
  }
  
  .task-content {
    padding: 0.75rem 1rem;
  }
  
  .task-actions {
    padding: 0.25rem 1rem 0.75rem 1rem;
  }
  
  .list-title {
    font-size: 1.3rem;
  }
}
</style>
