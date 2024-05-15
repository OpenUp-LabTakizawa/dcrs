'use server'

import type { FormState } from '@/app/interfaces/formState'
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const schema = z.object({
  name: z.string({
    invalid_type_error: 'Invalid name',
  }),
  company: z.string({
    invalid_type_error: 'Invalid company',
  }),
  employeeId: z.number({
    invalid_type_error: 'Invalid employeeId',
  }),
  telephone: z.string({
    invalid_type_error: 'Invalid telephone',
  }),
  email: z
    .string({
      invalid_type_error: 'Invalid email',
    })
    .email({
      message: 'Invalid Email',
    }),
  agreement: z.string({
    invalid_type_error: 'Invalid agreement',
  }),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.',
    ),
})

export async function validate(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    company: formData.get('company'),
    employeeId: formData.get('employeeId'),
    telephone: formData.get('telephone'),
    email: formData.get('email'),
    agreement: formData.get('agreement'),
    image: formData.get('image'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      value: {
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        employeeId: formData.get('employeeId') as string,
        telephone: formData.get('telephone') as string,
        email: formData.get('email') as string,
        agreement: formData.get('agreement') as string,
        image: formData.get('image')?.toString(),
      },
    }
  }
  return {
    success: true,
  }
}
