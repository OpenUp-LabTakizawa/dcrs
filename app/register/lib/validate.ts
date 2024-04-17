import { z } from 'zod'

const schema = z.object({
  name: z.string({
    required_error: '氏名は必須項目',
    invalid_type_error: '氏名は文字列を入力して下さい',
  }),
  company: z.string({
    required_error: '所属会社は必須項目',
    invalid_type_error: '所属会社は文字列を入力して下さい',
  }),
  employeeId: z.number({
    required_error: '社員番号は必須項目',
    invalid_type_error: '社員番号は数値を入力して下さい',
  }),
  telephone: z.string({
    required_error: '電話番号は必須項目',
    invalid_type_error: '電話番号は文字列を入力して下さい',
  }),
  email: z.string({
    required_error: 'メールアドレスは必須項目',
    invalid_type_error: 'メールアドレスは文字列を入力して下さい',
  }),
})

export async function validate(formData: FormData) {
  const validatedFields = await schema.safeParse(formData)
  console.log(formData)
  // if (!validatedFields.success) {
  //   return {
  //     errors: validatedFields.error,
  //   }
  // }
  return formData
}
