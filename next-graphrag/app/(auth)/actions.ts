'use server';

import { z } from 'zod';

// 使用后端接口进行用户注册与登录

import { signIn } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
  | 'idle'
  | 'in_progress'
  | 'success'
  | 'failed'
  | 'user_exists'
  | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    console.log('------------------')

    // 调用 FastAPI 注册接口
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL as string;

    console.log(JSON.stringify(apiBase))
    const res = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: validatedData.email,
        email: validatedData.email,
        password: validatedData.password,
        full_name: 'momo',
      }),
    });

    console.log(JSON.stringify(res))



    if (res.status === 400) {
      return { status: 'user_exists' } as RegisterActionState;
    }

    if (!res.ok) {
      return { status: 'failed' } as RegisterActionState;
    }

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
