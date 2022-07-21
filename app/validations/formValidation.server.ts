import type { ZodSchema } from "zod/lib/types";
import type { ZodError } from "zod/lib/ZodError";

export type SchemaErrorsT<G> = Partial<Record<keyof G, string>>;

export async function validateFormData<SchemaT>(request: Request, schema: ZodSchema) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  try {
    const formData = schema.parse(body) as SchemaT;

    return { formData, errors: null };
  } catch (e) {
    const errors = e as ZodError<SchemaT>;

    return {
      formData: body,
      errors: errors.issues.reduce((acc: SchemaErrorsT<SchemaT>, curr) => {
        const key = curr.path[0] as keyof SchemaT;
        acc[key] = curr.message;
        return acc;
      }, {}),
    };
  }
}
