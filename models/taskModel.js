import db from '../config/db.js';

const TaskModel = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY createdAt DESC');
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
  },
  async create({ text, priority = 'média', category = 'geral' }) {
    const [result] = await db.query('INSERT INTO tasks (text, priority, category) VALUES (?, ?, ?)', [text, priority, category]);
    return this.getById(result.insertId);
  },
  async update(id, { text, completed, priority, category }) {
    await db.query('UPDATE tasks SET text=?, completed=?, priority=?, category=? WHERE id=?', [text, completed, priority, category, id]);
    return this.getById(id);
  },
  async toggle(id) {
    await db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id]);
    return this.getById(id);
  },
  async delete(id) {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
  },
  async deleteAll() {
    await db.query('DELETE FROM tasks');
  }
};

export default TaskModel; 