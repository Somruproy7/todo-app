import { type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { randomUUID } from "crypto";
import mongoose, { Schema, Document, connect } from "mongoose";

export interface IStorage {
  getTasks(date?: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  getWeeklyStats(startDate: string, endDate: string): Promise<{ completed: number; pending: number; total: number }>;
}

interface ITaskDocument extends Document {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

const taskSchema = new Schema<ITaskDocument>({
  _id: { type: String, default: () => randomUUID() },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const TaskModel = mongoose.model<ITaskDocument>("Task", taskSchema, "tasks");

export class MongoDBStorage implements IStorage {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error("MONGODB_URI environment variable is not set");
      }

      await connect(mongoUri);
      this.initialized = true;
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    }
  }

  async getTasks(date?: string): Promise<Task[]> {
    await this.initialize();
    try {
      const query = date ? { date } : {};
      const tasks = await TaskModel.find(query).lean();
      return tasks.map((doc: any) => ({
        id: doc._id,
        title: doc.title,
        description: doc.description || "",
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        completed: doc.completed,
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  async getTask(id: string): Promise<Task | undefined> {
    await this.initialize();
    try {
      const doc = await TaskModel.findById(id).lean();
      if (!doc) return undefined;
      return {
        id: doc._id,
        title: doc.title,
        description: doc.description || "",
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        completed: doc.completed,
      };
    } catch (error) {
      console.error("Error fetching task:", error);
      return undefined;
    }
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    await this.initialize();
    const taskId = randomUUID();
    const task = new TaskModel({
      _id: taskId,
      title: insertTask.title,
      description: insertTask.description || "",
      date: insertTask.date,
      startTime: insertTask.startTime,
      endTime: insertTask.endTime,
      completed: insertTask.completed ?? false,
    });

    await task.save();
    return {
      id: taskId,
      title: insertTask.title,
      description: insertTask.description || "",
      date: insertTask.date,
      startTime: insertTask.startTime,
      endTime: insertTask.endTime,
      completed: insertTask.completed ?? false,
    };
  }

  async updateTask(id: string, updates: UpdateTask): Promise<Task | undefined> {
    await this.initialize();
    try {
      const updatedDoc = await TaskModel.findByIdAndUpdate(id, updates, {
        new: true,
        lean: true,
      });

      if (!updatedDoc) return undefined;

      return {
        id: updatedDoc._id,
        title: updatedDoc.title,
        description: updatedDoc.description || "",
        date: updatedDoc.date,
        startTime: updatedDoc.startTime,
        endTime: updatedDoc.endTime,
        completed: updatedDoc.completed,
      };
    } catch (error) {
      console.error("Error updating task:", error);
      return undefined;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.initialize();
    try {
      const result = await TaskModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }

  async getWeeklyStats(
    startDate: string,
    endDate: string
  ): Promise<{ completed: number; pending: number; total: number }> {
    await this.initialize();
    try {
      const weekTasks = await TaskModel.find({
        date: { $gte: startDate, $lte: endDate },
      });

      const completed = weekTasks.filter((t) => t.completed).length;
      const pending = weekTasks.filter((t) => !t.completed).length;

      return {
        completed,
        pending,
        total: weekTasks.length,
      };
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      return { completed: 0, pending: 0, total: 0 };
    }
  }
}

export const storage = new MongoDBStorage();
