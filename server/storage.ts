import { type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { randomUUID } from "crypto";
import mongoose, { Schema, Document, connect, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IStorage {
  getTasks(date?: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  getWeeklyStats(startDate: string, endDate: string): Promise<{ completed: number; pending: number; total: number }>;
}

interface ITaskDocument extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

const taskSchema = new Schema<ITaskDocument>({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
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
    if (this.initialized) {
      console.log("✅ MongoDB already initialized");
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI;
      console.log("🔌 Connecting to MongoDB...");
      console.log("📡 Connection string:", mongoUri ? "[HIDDEN FOR SECURITY]" : "NOT SET");
      
      if (!mongoUri) {
        throw new Error("❌ MONGODB_URI environment variable is not set");
      }

      await connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout for initial connection
      });
      
      this.initialized = true;
      console.log("✅ MongoDB connected successfully");
      
      // Test the connection
      if (!mongoose.connection.db) {
        throw new Error('MongoDB connection failed: Database instance is not available');
      }
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log("📂 Available collections:", collections.map(c => c.name));
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    }
  }

  async getTasks(date?: string): Promise<Task[]> {
    await this.initialize();
    try {
      const query = date ? { date } : {};
      console.log("🔍 Fetching tasks with query:", JSON.stringify(query));
      
      const tasks = await TaskModel.find(query).lean();
      console.log(`📊 Found ${tasks.length} tasks`);
      
      const result = tasks.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description || "",
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        completed: doc.completed,
      }));
      
      console.log("📤 Returning tasks:", JSON.stringify(result, null, 2));
      return result;
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
        id: doc._id.toString(),
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
    console.log("📝 Creating new task with data:", JSON.stringify(insertTask, null, 2));
    await this.initialize();
    
    try {
      const task = new TaskModel({
        ...insertTask,
        _id: new Types.ObjectId(),
        description: insertTask.description || "",
        completed: insertTask.completed ?? false
      });
      
      console.log("💾 Saving task to database...");
      const savedTask = await task.save();
      console.log("✅ Task saved successfully:", savedTask);
      
      const result = {
        id: savedTask._id.toString(),
        title: savedTask.title,
        description: savedTask.description || "",
        date: savedTask.date,
        startTime: savedTask.startTime,
        endTime: savedTask.endTime,
        completed: savedTask.completed,
      };
      
      console.log("📤 Returning created task:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("❌ Error creating task:", error);
      throw error;
    }
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
        id: updatedDoc._id.toString(),
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
  