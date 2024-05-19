<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <task-form @add-task="addTask"/>
        <task-list :tasks="tasks" @edit-task="editTask" @delete-task="deleteTask" @mark-completed="markAsCompleted"/>
      </v-container>
    </v-main>

    <v-footer>
      <v-container>
        <v-row>
          <v-col>Application &copy; {{ new Date().getFullYear() }}</v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';

export default {
  components: {
    TaskList,
    TaskForm,
  },
  data() {
    return {
      newTask: '',
      tasks: [],
    }
  },
  methods: {
    addTask(task) {
      this.tasks.push(task);
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
    editTask(index) {
      this.tasks[index].editing = !this.tasks[index].editing;
    },
    markAsCompleted(index) {
      this.tasks[index].completed = !this.tasks[index].completed;
    }
  }
}
</script>
