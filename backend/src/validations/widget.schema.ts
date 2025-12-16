/**
 * Widget API Validation Schemas
 * 
 * Strict Zod schemas to validate all widget API inputs, preventing
 * injection attacks and malformed data from crashing the backend.
 */

import { z } from 'zod';

// Position schema - validates widget grid placement
export const positionSchema = z.object({
    x: z.number().int().min(0).max(20),
    y: z.number().int().min(0).max(100),
    w: z.number().int().min(1).max(6),
    h: z.number().int().min(1).max(6),
}).strict();

// Config schema - allows flexible widget configurations but limits depth/size
export const configSchema = z.record(
    z.string().max(100), // Key max length
    z.union([
        z.string().max(10000),  // Text content (e.g., sticky notes)
        z.number(),
        z.boolean(),
        z.array(z.unknown()).max(100),  // Arrays with size limit
        z.record(z.string(), z.unknown()).refine(
            (obj) => JSON.stringify(obj).length < 50000,
            { message: 'Nested config too large' }
        ),
    ])
).refine((obj) => JSON.stringify(obj).length < 100000, {
    message: 'Config payload too large (max 100KB)',
});

// Install widget schema
export const installWidgetSchema = z.object({
    templateId: z.number().int().positive(),
    position: positionSchema.optional(),
});

// Update widget schema
export const updateWidgetSchema = z.object({
    config: configSchema.optional(),
    position: positionSchema.optional(),
}).refine((data) => data.config || data.position, {
    message: 'At least one of config or position must be provided',
});

// Widget ID param schema
export const widgetIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'Widget ID must be a positive integer'),
});

export type InstallWidgetInput = z.infer<typeof installWidgetSchema>;
export type UpdateWidgetInput = z.infer<typeof updateWidgetSchema>;
export type Position = z.infer<typeof positionSchema>;
export type WidgetConfig = z.infer<typeof configSchema>;
