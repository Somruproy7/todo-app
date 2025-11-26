import { type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTasks(date?: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  getWeeklyStats(startDate: string, endDate: string): Promise<{ completed: number; pending: number; total: number }>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;

  constructor() {
    this.tasks = new Map();
  }

  async getTasks(date?: string): Promise<Task[]> {
    const allTasks = Array.from(this.tasks.values());
    if (date) {
      return allTasks.filter((task) => task.date === date);
    }
    return allTasks;
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description || "",
      date: insertTask.date,
      startTime: insertTask.startTime,
      endTime: insertTask.endTime,
      completed: insertTask.completed ?? false,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: UpdateTask): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask: Task = {
      ...task,
      ...updates,
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getWeeklyStats(startDate: string, endDate: string): Promise<{ completed: number; pending: number; total: number }> {
    const allTasks = Array.from(this.tasks.values());
    const weekTasks = allTasks.filter((task) => {
      return task.date >= startDate && task.date <= endDate;
    });

    const completed = weekTasks.filter((t) => t.completed).length;
    const pending = weekTasks.filter((t) => !t.completed).length;

    return {
      completed,
      pending,
      total: weekTasks.length,
    };
  }
}

export const storage = new MemStorage();
