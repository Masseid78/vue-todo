<template>
  <v-card class="task-form-card" elevation="12">
    <v-card-title class="form-title">
      <v-icon class="mr-3 title-icon">mdi-plus-circle</v-icon>
      Adicionar Nova Tarefa
    </v-card-title>
    
    <v-card-text class="form-content">
      <v-form @submit.prevent="submitTask" class="task-form">
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="taskText"
              label="O que você precisa fazer?"
              placeholder="Ex: Estudar Vue.js, Fazer exercícios, Ler um livro..."
              variant="outlined"
              color="primary"
              prepend-inner-icon="mdi-format-list-text"
              :rules="[rules.required, rules.minLength]"
              class="task-input"
              @keyup.enter="submitTask"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-btn
              type="submit"
              color="primary"
              size="large"
              class="submit-btn"
              :disabled="!taskText.trim()"
              :loading="loading"
              elevation="4"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Adicionar
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Campo de prioridade -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-select
              v-model="priority"
              :items="priorityOptions"
              label="Prioridade"
              variant="outlined"
              color="primary"
              prepend-inner-icon="mdi-flag"
              class="priority-select"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="category"
              :items="categoryOptions"
              label="Categoria"
              variant="outlined"
              color="primary"
              prepend-inner-icon="mdi-tag"
              class="category-select"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      taskText: '',
      priority: 'média',
      category: 'geral',
      loading: false,
      rules: {
        required: v => !!v || 'Campo obrigatório',
        minLength: v => v.length >= 3 || 'Mínimo 3 caracteres'
      },
      priorityOptions: [
        { title: 'Baixa', value: 'baixa', color: 'success' },
        { title: 'Média', value: 'média', color: 'warning' },
        { title: 'Alta', value: 'alta', color: 'error' }
      ],
      categoryOptions: [
        { title: 'Geral', value: 'geral', icon: 'mdi-format-list-bulleted' },
        { title: 'Trabalho', value: 'trabalho', icon: 'mdi-briefcase' },
        { title: 'Estudo', value: 'estudo', icon: 'mdi-school' },
        { title: 'Pessoal', value: 'pessoal', icon: 'mdi-account' },
        { title: 'Saúde', value: 'saúde', icon: 'mdi-heart' },
        { title: 'Lazer', value: 'lazer', icon: 'mdi-gamepad-variant' }
      ]
    }
  },
  methods: {
    async submitTask() {
      if (!this.taskText.trim()) return;
      
      this.loading = true;
      
      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const task = {
        text: this.taskText,
        completed: false,
        editing: false,
        priority: this.priority,
        category: this.category,
        createdAt: new Date().toISOString()
      };
      
      this.$emit('add-task', task);
      this.taskText = '';
      this.priority = 'média';
      this.category = 'geral';
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.task-form-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  animation: slideInDown 0.8s ease-out;
}

.task-form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.form-title {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.5rem;
  padding: 2rem 2rem 1rem 2rem;
}

.title-icon {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-content {
  padding: 1rem 2rem 2rem 2rem;
}

.task-input {
  font-size: 1.1rem;
}

.task-input :deep(.v-field__input) {
  font-size: 1.1rem;
}

.submit-btn {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  height: 56px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  background: #e0e0e0 !important;
  transform: none;
  box-shadow: none;
}

.priority-select,
.category-select {
  font-size: 1rem;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .form-title {
    font-size: 1.3rem;
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  }
  
  .form-content {
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
  }
  
  .submit-btn {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
