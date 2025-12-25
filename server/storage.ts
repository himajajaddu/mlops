import { predictions, type InsertPrediction, type Prediction } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPredictions(): Promise<Prediction[]>;
  getPredictionStats(): Promise<{ total: number; positive: number; negative: number }>;
}

export class DatabaseStorage implements IStorage {
  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return prediction;
  }

  async getPredictions(): Promise<Prediction[]> {
    return await db.select().from(predictions).orderBy(predictions.createdAt);
  }

  async getPredictionStats(): Promise<{ total: number; positive: number; negative: number }> {
    const all = await db.select().from(predictions);
    const positive = all.filter(p => p.prediction === 1).length;
    return {
      total: all.length,
      positive,
      negative: all.length - positive
    };
  }
}

export const storage = new DatabaseStorage();
