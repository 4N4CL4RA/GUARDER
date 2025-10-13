// Serviço para autenticação de usuários - Guarder
import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      nome: string;
      sobrenome: string;
      email: string;
      telefone: string;
      created_at: string;
    };
    token?: string;
  };
}

// Login com Supabase
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error || !loginData.user) {
      return { success: false, message: error?.message || 'Erro ao fazer login' };
    }

    // Monta usuário no formato esperado
    const user = {
      id: loginData.user.id,
      nome: loginData.user.user_metadata?.nome || '',
      sobrenome: loginData.user.user_metadata?.sobrenome || '',
      email: loginData.user.email,
      telefone: loginData.user.user_metadata?.telefone || '',
      created_at: loginData.user.created_at
    };

    localStorage.setItem('authToken', loginData.session?.access_token || '');
    localStorage.setItem('userData', JSON.stringify(user));

    return {
      success: true,
      message: 'Login realizado com sucesso!',
      data: {
        user,
        token: loginData.session?.access_token
      }
    };
  } catch (error) {
    await logoutUser();
    const errorMsg = error instanceof Error ? error.message : 'Token inválido';
    return { success: false, message: errorMsg };
  }
};

// Registro com Supabase
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Gera hash da senha antes de salvar na tabela profiles
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { data: regData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nome: data.nome,
          sobrenome: data.sobrenome,
          telefone: data.telefone
        }
      }
    });

    if (error || !regData.user) {
      return { success: false, message: error?.message || 'Erro ao registrar' };
    }

    // Inserir dados na tabela profiles
    await supabase
      .from('profiles')
      .insert([
        {
          nome: data.nome,
          sobrenome: data.sobrenome,
          email: data.email,
          telefone: data.telefone,
          senha_hash: hashedPassword
        }
      ]);

    const user = {
      id: regData.user.id,
      nome: regData.user.user_metadata?.nome || '',
      sobrenome: regData.user.user_metadata?.sobrenome || '',
      email: regData.user.email,
      telefone: regData.user.user_metadata?.telefone || '',
      created_at: regData.user.created_at
    };

    localStorage.setItem('authToken', regData.session?.access_token || '');
    localStorage.setItem('userData', JSON.stringify(user));

    return {
      success: true,
      message: 'Cadastro realizado com sucesso!',
      data: {
        user,
        token: regData.session?.access_token
      }
    };
  } catch (error) {
    await logoutUser();
    const errorMsg = error instanceof Error ? error.message : 'Token inválido';
    return { success: false, message: errorMsg };
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Função para obter dados do usuário logado
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Função para fazer logout
export const logoutUser = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Função para verificar token com Supabase
export const verifyToken = async (): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      await logoutUser();
      return { success: false, message: error?.message || 'Token inválido' };
    }
    return {
      success: true,
      message: 'Token válido',
      data: {
        user: {
          id: data.user.id,
          nome: data.user.user_metadata?.nome || '',
          sobrenome: data.user.user_metadata?.sobrenome || '',
          email: data.user.email,
          telefone: data.user.user_metadata?.telefone || '',
          created_at: data.user.created_at
        }
      }
    };
  } catch (error) {
    await logoutUser();
    const errorMsg = error instanceof Error ? error.message : 'Token inválido';
    return { success: false, message: errorMsg };
  }
};
