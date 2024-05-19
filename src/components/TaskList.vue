<template>
  <v-card v-if="tasks.length > 0" class="card mx-auto mt-4" max-width="600">
    <v-card-title>Tarefas</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="(task, index) in tasks" :key="index">
          <v-list-item-content>
            <v-text-field
              v-model="task.text"
              :disabled="!task.editing"
              @keyup.enter="editTask(index)"
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="editTask(index)" class="edit-task-button">
              <v-icon>{{ task.editing ? 'mdi-content-save' : 'mdi-pencil' }}</v-icon>
            </v-btn>
            <v-btn icon @click="deleteTask(index)" class="delete-task-button">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon @click="markAsCompleted(index)" class="completed-task-button">
              <v-icon>{{ task.completed ? 'mdi-check' : 'mdi-checkbox-blank-outline' }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
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
  },
};
</script>

<style scoped>
.card {
  background-color: #B0E0E6;
  color: #000000;
}

.card { background-color: #B0E0E6; 
}

.v-card-title,
.v-icon,
.v-btn {
  color: #000000;
}

.edit-task-button {
  margin-left: 380px;
}

.delete-task-button {
  margin-left: 2px;
}

.completed-task-button {
  margin-left: 2px;
}

.v-list-item-action {
  display: flex;
  align-items: center;
  margin-top: -30px;
}
</style>
