import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  error?: NextResponse;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return {
        success: false,
        error: NextResponse.json(
          { error: validationError.message },
          { status: 400 }
        ),
      };
    }
    return {
      success: false,
      error: NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      ),
    };
  }
}

export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{
  success: boolean;
  data?: T;
  error?: NextResponse;
}> {
  try {
    const requestData = await request.json();
    return validateWithSchema(schema, requestData);
  } catch (err) {
    return {
      success: false,
      error: NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      ),
    };
  }
}
