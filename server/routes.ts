import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- API Routes for Web Demo ---

  app.post(api.predictions.create.path, async (req, res) => {
    try {
      const input = api.predictions.create.input.parse(req.body);
      
      // Mock Prediction Logic (Simple heuristic for demo purposes)
      // High cholesterol (>240) + High BP (>140) + Age > 50 -> Higher risk
      let riskScore = 0;
      if (input.age > 50) riskScore += 0.2;
      if (input.chol > 240) riskScore += 0.3;
      if (input.trestbps > 140) riskScore += 0.2;
      if (input.cp > 0) riskScore += 0.2; // Chest pain present
      if (input.thalach > 160) riskScore -= 0.1; // Good heart rate
      
      const probability = Math.min(Math.max(0.1, riskScore + 0.1), 0.95);
      const predictionValue = probability > 0.5 ? 1 : 0;

      const prediction = await storage.createPrediction({
        ...input,
        prediction: predictionValue,
        probability: Number(probability.toFixed(2))
      });
      res.status(201).json(prediction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.predictions.list.path, async (req, res) => {
    const predictions = await storage.getPredictions();
    res.json(predictions);
  });

  app.get(api.predictions.stats.path, async (req, res) => {
    const stats = await storage.getPredictionStats();
    res.json(stats);
  });

  // --- Project Structure Browser API ---

  const PROJECT_ROOT = path.join(process.cwd(), 'heart-disease-mlops');

  app.get(api.project.structure.path, async (req, res) => {
    try {
      if (!fs.existsSync(PROJECT_ROOT)) {
         return res.json([]);
      }

      const getStructure = (dir: string): any[] => {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        return items.map(item => {
          const fullPath = path.join(dir, item.name);
          const relativePath = path.relative(PROJECT_ROOT, fullPath);
          return {
            name: item.name,
            type: item.isDirectory() ? 'directory' : 'file',
            path: relativePath,
            children: item.isDirectory() ? getStructure(fullPath) : undefined
          };
        });
      };

      const structure = getStructure(PROJECT_ROOT);
      res.json(structure);
    } catch (error) {
      console.error("Error reading project structure:", error);
      res.status(500).json({ message: "Failed to read project structure" });
    }
  });

  app.get(api.project.file.path, async (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) {
      return res.status(400).json({ message: "Path is required" });
    }

    // Prevent directory traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(PROJECT_ROOT, safePath);

    if (!fullPath.startsWith(PROJECT_ROOT)) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: "File not found" });
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      res.json({ content });
    } catch (error) {
      res.status(500).json({ message: "Failed to read file" });
    }
  });

  return httpServer;
}
