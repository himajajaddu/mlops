import { z } from 'zod';
import { insertPredictionSchema, predictions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  predictions: {
    create: {
      method: 'POST' as const,
      path: '/api/predictions',
      input: insertPredictionSchema,
      responses: {
        201: z.custom<typeof predictions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/predictions',
      responses: {
        200: z.array(z.custom<typeof predictions.$inferSelect>()),
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/predictions/stats',
      responses: {
        200: z.object({
          total: z.number(),
          positive: z.number(),
          negative: z.number(),
        }),
      },
    }
  },
  project: {
    structure: {
      method: 'GET' as const,
      path: '/api/project/structure',
      responses: {
        200: z.custom<{ name: string; type: string; children?: any[] }[]>(),
      },
    },
    file: {
      method: 'GET' as const,
      path: '/api/project/file',
      input: z.object({ path: z.string() }),
      responses: {
        200: z.object({ content: z.string() }),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
