// Serviço para autenticação de usuários - Guarder
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
      id: number;
      nome: string;
      sobrenome: string;
      email: string;
      telefone: string;
      created_at: string;
    };
    token?: string;
  };
}

// Função para fazer login
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro na autenticação');
    }

    // Salva o token no localStorage
    if (result.token) {
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
    }

    return { 
      success: true, 
      message: result.message || 'Login realizado com sucesso!', 
      data: result 
    };

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.' 
    };
  }
};

// Função para registrar usuário
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro no cadastro');
    }

    return { 
      success: true, 
      message: result.message || 'Cadastro realizado com sucesso!', 
      data: result 
    };

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro ao registrar usuário. Tente novamente.' 
    };
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  return !!(token && userData);
};

// Função para obter dados do usuário logado
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Função para fazer logout
export const logoutUser = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Função para verificar se o token é válido
export const verifyToken = async (): Promise<AuthResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch('http://localhost:4000/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Token inválido');
    }

    return { 
      success: true, 
      message: 'Token válido', 
      data: result 
    };

  } catch (error) {
    console.error('Erro ao verificar token:', error);
    // Remove dados inválidos
    logoutUser();
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Token inválido' 
    };
  }
};
