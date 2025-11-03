import { z } from 'zod';

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const partSchema = z.object({
  item_code: z.string(),
  name: z.string(),
  unit: z.string(),
  cost: z.number().min(0),
  stock_qty: z.number().min(0),
  supplier_id: z.string().optional(),
  reorder_point: z.number().min(0).optional(),
  lead_time: z.number().min(0).optional(),
});

export const bomSchema = z.object({
  product_id: z.string(),
  type: z.enum(['assembly', 'component']),
  version: z.string(),
  items: z.array(z.object({
    part_id: z.string(),
    qty: z.number().min(0),
  })),
});

export const workOrderSchema = z.object({
  product_id: z.string(),
  qty: z.number().min(1),
  status: z.enum(['Planned', 'In Progress', 'Completed']),
  schedule_start: z.string().optional(),
  schedule_end: z.string().optional(),
  assigned_line: z.string().optional(),
});

export const supplierSchema = z.object({
  name: z.string(),
  contact_person: z.string(),
  lead_time_days: z.number().min(0),
  rating: z.number().min(0).max(5).optional(),
});

export const purchaseOrderSchema = z.object({
  supplier_id: z.string(),
  items: z.array(z.object({
    part_id: z.string(),
    qty: z.number().min(1),
    cost: z.number().min(0),
  })),
  status: z.enum(['Draft', 'Sent', 'Received']),
});

export const qcRecordSchema = z.object({
  part_id: z.string().optional(),
  work_order_id: z.string().optional(),
  inspector: z.string(),
  pass_fail: z.boolean(),
  remarks: z.string().optional(),
});

