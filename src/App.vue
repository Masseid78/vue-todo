<template>
  <v-app id="inspire" class="app-container">
    <!-- Header com gradiente e animação -->
    <v-app-bar class="app-header" elevation="0">
      <v-container class="d-flex align-center">
        <div class="d-flex align-center">
          <v-icon size="32" class="mr-3 header-icon">mdi-checkbox-marked-circle</v-icon>
          <v-app-bar-title class="app-title">TaskMaster Pro</v-app-bar-title>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <v-chip class="ma-2" color="success" variant="outlined">
            <v-icon start>mdi-clock-outline</v-icon>
            {{ tasks.length }} tarefas
          </v-chip>
          <v-chip class="ma-2" color="primary" variant="outlined">
            <v-icon start>mdi-check-circle</v-icon>
            {{ completedTasks }} concluídas
          </v-chip>
          <v-btn
            icon
            @click="refreshData"
            :loading="loading"
            class="ml-2"
            title="Atualizar dados"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Conteúdo principal com gradiente de fundo -->
    <v-main class="main-content">
      <v-container class="py-8">
        <!-- Hero Section -->
        <v-row justify="center" class="mb-8">
          <v-col cols="12" md="8" class="text-center">
            <div class="hero-section">
              <h1 class="hero-title">Organize sua vida com estilo</h1>
              <p class="hero-subtitle">Uma experiência incrível para gerenciar suas tarefas diárias</p>
            </div>
          </v-col>
        </v-row>

        <!-- Alertas de status -->
        <v-row justify="center" class="mb-4">
          <v-col cols="12" md="8">
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              closable
              @click:close="error = null"
            >
              {{ error }}
            </v-alert>
            <v-alert
              v-if="success"
              type="success"
              variant="tonal"
              closable
              @click:close="success = null"
            >
              {{ success }}
            </v-alert>
          </v-col>
        </v-row>

        <!-- Componentes principais -->
        <v-row justify="center">
          <v-col cols="12" md="8">
            <task-form @add-task="addTask" class="mb-6"/>
            <task-list 
              :tasks="tasks" 
              :loading="loading"
              @edit-task="editTask" 
              @delete-task="deleteTask" 
              @mark-completed="markAsCompleted"
              class="task-list-container"
            />
          </v-col>
        </v-row>

        <!-- Seção de estatísticas -->
        <v-row justify="center" class="mt-8">
          <v-col cols="12" md="8">
            <v-card class="stats-card" elevation="8">
              <v-card-text class="text-center">
                <v-row>
                  <v-col cols="4">
                    <div class="stat-item">
                      <v-icon size="48" color="primary">mdi-format-list-checks</v-icon>
                      <h3 class="stat-number">{{ tasks.length }}</h3>
                      <p class="stat-label">Total de Tarefas</p>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="stat-item">
                      <v-icon size="48" color="success">mdi-check-circle</v-icon>
                      <h3 class="stat-number">{{ completedTasks }}</h3>
                      <p class="stat-label">Concluídas</p>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="stat-item">
                      <v-icon size="48" color="warning">mdi-clock</v-icon>
                      <h3 class="stat-number">{{ pendingTasks }}</h3>
                      <p class="stat-label">Pendentes</p>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer moderno -->
    <v-footer class="app-footer">
      <v-container>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <div class="d-flex align-center justify-center mb-2">
              <v-icon class="mr-2"></v-icon>
              <span></span>
            </div>
            <p class="text-caption">TaskMaster Pro &copy; {{ new Date().getFullYear() }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Loading overlay -->
    <v-overlay
      v-model="loading"
      class="align-center justify-center"
    >
      <v-progress-circular
        size="64"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';
import apiService from './services/api.js';

export default {
  components: {
    TaskList,
    TaskForm,
  },
  data() {
    return {
      tasks: [],
      loading: false,
      error: null,
      success: null,
    }
  },
  computed: {
    completedTasks() {
      return this.tasks.filter(task => task.completed).length;
    },
    pendingTasks() {
      return this.tasks.filter(task => !task.completed).length;
    }
  },
  async mounted() {
    await this.loadTasks();
  },
  methods: {
    async loadTasks() {
      try {
        this.loading = true;
        const response = await apiService.getTasks();
        this.tasks = response.data;
        this.error = null;
      } catch (error) {
        this.error = 'Erro ao carregar tarefas: ' + error.message;
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        this.loading = false;
      }
    },

    async addTask(taskData) {
      try {
        this.loading = true;
        const response = await apiService.createTask(taskData);
        this.tasks.unshift(response.data);
        this.success = 'Tarefa criada com sucesso!';
        this.error = null;
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          this.success = null;
        }, 3000);
      } catch (error) {
        this.error = 'Erro ao criar tarefa: ' + error.message;
        console.error('Erro ao criar tarefa:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(index) {
      try {
        const task = this.tasks[index];
        this.loading = true;
        await apiService.deleteTask(task._id);
        this.tasks.splice(index, 1);
        this.success = 'Tarefa excluída com sucesso!';
        this.error = null;
        
        setTimeout(() => {
          this.success = null;
        }, 3000);
      } catch (error) {
        this.error = 'Erro ao excluir tarefa: ' + error.message;
        console.error('Erro ao excluir tarefa:', error);
      } finally {
        this.loading = false;
      }
    },

    async editTask(index) {
      const task = this.tasks[index];
      if (task.editing) {
        // Salvar edição
        try {
          this.loading = true;
          const response = await apiService.updateTask(task._id, {
            text: task.text,
            priority: task.priority,
            category: task.category
          });
          this.tasks[index] = { ...response.data, editing: false };
          this.success = 'Tarefa atualizada com sucesso!';
          this.error = null;
          
          setTimeout(() => {
            this.success = null;
          }, 3000);
        } catch (error) {
          this.error = 'Erro ao atualizar tarefa: ' + error.message;
          console.error('Erro ao atualizar tarefa:', error);
        } finally {
          this.loading = false;
        }
      } else {
        // Entrar no modo de edição
        this.tasks[index].editing = true;
      }
    },

    async markAsCompleted(index) {
      try {
        const task = this.tasks[index];
        this.loading = true;
        const response = await apiService.toggleTask(task._id);
        this.tasks[index] = response.data;
        this.success = `Tarefa ${response.data.completed ? 'marcada como concluída' : 'desmarcada'}!`;
        this.error = null;
        
        setTimeout(() => {
          this.success = null;
        }, 3000);
      } catch (error) {
        this.error = 'Erro ao atualizar tarefa: ' + error.message;
        console.error('Erro ao atualizar tarefa:', error);
      } finally {
        this.loading = false;
      }
    },

    async refreshData() {
      await this.loadTasks();
    }
  }
}
</script>

<style scoped>
.app-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-header {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-icon {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-title {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.5rem;
}

.main-content {
  background: transparent;
}

.hero-section {
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease-out;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 0.3s both;
}

.task-list-container {
  animation: fadeInUp 1s ease-out 0.6s both;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  padding: 1rem;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin: 0.5rem 0;
}

.stat-label {
  color: #666;
  font-weight: 500;
  margin: 0;
}

.app-footer {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: #666;
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

/* Responsividade */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .app-title {
    font-size: 1.2rem;
  }
}
</style>
