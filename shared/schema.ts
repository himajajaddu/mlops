import { pgTable, text, serial, integer, boolean, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  age: integer("age").notNull(),
  sex: integer("sex").notNull(), // 0 or 1
  cp: integer("cp").notNull(), // chest pain type
  trestbps: integer("trestbps").notNull(), // resting blood pressure
  chol: integer("chol").notNull(), // cholesterol
  fbs: integer("fbs").notNull(), // fasting blood sugar
  restecg: integer("restecg").notNull(), // resting electrocardiographic results
  thalach: integer("thalach").notNull(), // max heart rate achieved
  exang: integer("exang").notNull(), // exercise induced angina
  oldpeak: real("oldpeak").notNull(), // ST depression
  slope: integer("slope").notNull(), // slope of peak exercise ST segment
  ca: integer("ca").notNull(), // number of major vessels
  thal: integer("thal").notNull(), // thalassemia
  prediction: integer("prediction").notNull(), // 0 or 1
  probability: real("probability").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
  prediction: true,
  probability: true
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;

// MLOps Project File Structure Type
export type ProjectFile = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  children?: ProjectFile[];
};
