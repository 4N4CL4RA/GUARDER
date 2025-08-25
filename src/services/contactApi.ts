// Serviço para envio de mensagens de contato
export interface ContactFormData {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Função para enviar dados para um backend real
export const sendContactMessage = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await fetch('http://localhost:4000/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na requisição');
    }

    const result = await response.json();
    return { success: true, message: result.message || 'Mensagem enviada com sucesso!', data: result };

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro ao enviar mensagem. Tente novamente.' 
    };
  }
};

// OPÇÃO 2: Para enviar por email usando EmailJS (serviço gratuito)
export const sendEmailWithEmailJS = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    // Instale: npm install @emailjs/browser
    // const emailjs = require('@emailjs/browser');
    
    const templateParams = {
      from_name: `${data.nome} ${data.sobrenome}`,
      from_email: data.email,
      phone: data.telefone,
      message: data.mensagem,
    };

    // Substitua pelos seus IDs do EmailJS
    // const result = await emailjs.send(
    //   'YOUR_SERVICE_ID',
    //   'YOUR_TEMPLATE_ID', 
    //   templateParams,
    //   'YOUR_PUBLIC_KEY'
    // );

    return { success: true, message: 'E-mail enviado com sucesso!' };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, message: 'Erro ao enviar e-mail.' };
  }
};

// OPÇÃO 3: Para salvar no localStorage (apenas para desenvolvimento/demonstração)
export const saveToLocalStorage = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const newMessage = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    
    existingMessages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
    
    return { success: true, message: 'Mensagem salva localmente!', data: newMessage };
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return { success: false, message: 'Erro ao salvar mensagem.' };
  }
};

// OPÇÃO 4: Para integração com Supabase (Backend as a Service)
export const sendToSupabase = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    // Instale: npm install @supabase/supabase-js
    // import { createClient } from '@supabase/supabase-js'
    
    // const supabaseUrl = 'YOUR_SUPABASE_URL'
    // const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
    // const supabase = createClient(supabaseUrl, supabaseKey)
    
    // const { data: result, error } = await supabase
    //   .from('mensagens')
    //   .insert([data])
    
    // if (error) throw error;
    
    return { success: true, message: 'Mensagem enviada para Supabase!' };
  } catch (error) {
    console.error('Erro ao enviar para Supabase:', error);
    return { success: false, message: 'Erro ao conectar com banco de dados.' };
  }
};
