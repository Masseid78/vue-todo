<template>
  <v-card class="card mx-auto" max-width="600">
    <v-card-title>Gerenciar Tarefas</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitTask">
        <v-text-field v-model="taskText" label="Nova Tarefa" required></v-text-field>
        <v-btn type="submit">Adicionar Tarefa</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      taskText: ''
    }
  },
  methods: {
    submitTask() {
      this.$emit('add-task', { text: this.taskText, completed: false, editing: false });
      this.taskText = '';
    }
  }
}
</script>

<style scoped>
.card {
  background-color: #B0E0E6;
  color: #000000;
}

.v-card-title,
.v-btn,
.v-text-field {
  color: #000000;
}
</style>
