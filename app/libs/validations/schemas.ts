import { z } from "zod";

// User Schemas
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  image: z.string().url().optional(),
});

export const userCreateSchema = userSchema.pick({ name: true, email: true });
export const userUpdateSchema = userSchema.partial();

// Chat Schemas
export const messageInputSchema = z.object({
  message: z.string().min(1).max(2000).optional(),
  image: z.string().url().optional().nullable(),
  conversationId: z.string().min(1),
});
export const messageSchema = z.object({
  id: z.string(),
  body: z.string(),
  image: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  seenIds: z.array(z.string()).optional(),
  senderId: z.string(),
  conversationId: z.string(),
  sender: z.any(),
  seen: z.any().optional(),
});

export const chatSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  userId: z.string(),
  messages: z.array(messageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const chatCreateSchema = chatSchema.pick({ title: true });
export const chatUpdateSchema = chatSchema.pick({ title: true }).partial();

// API Input Schemas
export const apiChatInputSchema = z.object({
  message: z.string().min(1).max(2000),
});

export const apiUserInputSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

// Query Parameter Schemas
export const paginationSchema = z.object({
  limit: z.number().int().positive().max(100).default(10),
  offset: z.number().int().nonnegative().default(0),
});

// Environment Variables Schema
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

// Define validation schemas

export const pusherChannelSchema = z.string().min(1);
export const pusherEventSchema = z.string().min(1);

export const conversationParamsSchema = z.object({
  conversationId: z
    .string()
    .uuid({ message: "Invalid conversation ID format" }),
});
export const groupConversationSchema = z.object({
  isGroup: z.literal(true),
  name: z.string().min(1, "Group name is required"),
  members: z
    .array(
      z.object({
        value: z.string().uuid("Invalid user ID"),
      })
    )
    .min(2, "At least 2 members required"),
});

export const oneOnOneConversationSchema = z.object({
  isGroup: z.literal(false).optional(), // defaults to false if missing
  userId: z.string().uuid("Invalid user ID"),
});

export const conversationSchema = z.union([
  groupConversationSchema,
  oneOnOneConversationSchema,
]);

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").optional(),
  password: z.string().min(3, "Password must be at least 3 characters"),
});
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL").nullable().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role type",
  }),
});

// Define schema for the props of ConversationList component
export const conversationListSchema = z.object({
  initialItems: z.array(conversationSchema),
  users: z.array(userSchema),
});
