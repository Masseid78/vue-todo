const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // GET - Buscar todas as tarefas
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  // GET - Buscar estatísticas
  async getStats() {
    return this.request('/tasks/stats');
  }

  // GET - Buscar uma tarefa específica
  async getTask(id) {
    return this.request(`/tasks/${id}`);
  }

  // POST - Criar nova tarefa
  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // PUT - Atualizar tarefa
  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // PATCH - Alternar status de conclusão
  async toggleTask(id) {
    return this.request(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // DELETE - Excluir tarefa
  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // DELETE - Excluir todas as tarefas
  async deleteAllTasks() {
    return this.request('/tasks?confirm=true', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Instância única do serviço
const apiService = new ApiService();

export default apiService; 