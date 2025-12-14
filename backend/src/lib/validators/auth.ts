import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Некорректный номер телефона'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  firstName: z.string().optional(),
  lastName: z.string().optional()
})

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Введите email или телефон'),
  password: z.string().min(1, 'Введите пароль'),
  deviceId: z.string().optional(),
  deviceName: z.string().optional()
})

export const pinLoginSchema = z.object({
  pinCode: z.string().length(4, 'PIN-код должен содержать 4 цифры').regex(/^\d+$/, 'PIN-код должен содержать только цифры'),
  deviceId: z.string().min(1, 'Device ID обязателен')
})

export const setPinSchema = z.object({
  pinCode: z.string().length(4, 'PIN-код должен содержать 4 цифры').regex(/^\d+$/, 'PIN-код должен содержать только цифры'),
  deviceId: z.string().min(1, 'Device ID обязателен')
})