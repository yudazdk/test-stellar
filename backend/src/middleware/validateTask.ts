import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Allowed task fields based on existing seed values and defaults.
const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

const taskIdParamsSchema = z.object({
  id: z.string().min(1, 'Task id is required'),
});

const taskCreateSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: taskStatusEnum,
    priority: taskPriorityEnum,
  })
  .strict();

const taskUpdateSchema = z
  .object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    description: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  );

const taskQuerySchema = z
  .object({
    q: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
  })
  .strict();

type SchemaTarget = 'body' | 'params' | 'query';

const validate =
  (schema: z.ZodTypeAny, target: SchemaTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    // Replace with parsed data to ensure types/stripping handled by zod.
    (req as any)[target] = result.data;
    next();
  };

export const validateTaskCreate = validate(taskCreateSchema);
export const validateTaskUpdate = validate(taskUpdateSchema);
export const validateTaskIdParam = validate(taskIdParamsSchema, 'params');
export const validateTaskQuery = validate(taskQuerySchema, 'query');

