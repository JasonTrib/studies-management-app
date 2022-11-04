import type { ZodSchema } from "zod/lib/types";
import type { ZodError } from "zod/lib/ZodError";

export type SchemaErrorsT<G> = Partial<Record<keyof G, string>>;

export type FormValidationT<G> = {
  data?: G;
  errors?: SchemaErrorsT<G>;
};

export async function extractAndValidateFormData<SchemaT>(request: Request, schema: ZodSchema) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  return validateFormData<SchemaT>(body, schema);
}

export function validateFormData<SchemaT>(
  body: { [k: string]: FormDataEntryValue | Date },
  schema: ZodSchema,
) {
  try {
    const data = schema.parse(body) as SchemaT;

    return { data, errors: null };
  } catch (e) {
    const errors = e as ZodError<SchemaT>;

    return {
      data: null,
      errors: errors.issues.reduce((acc: SchemaErrorsT<SchemaT>, curr) => {
        const key = curr.path[0] as keyof SchemaT;
        acc[key] = curr.message;
        return acc;
      }, {}),
    };
  }
}
