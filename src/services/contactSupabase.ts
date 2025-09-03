import { ContactFormData, ContactResponse } from './contactApi';
import { supabase } from './supabaseClient';

export const sendContactMessage = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const { error } = await supabase.from('contacts').insert([data]);
    if (error) {
      throw new Error(error.message);
    }
    return { success: true, message: 'Mensagem enviada com sucesso!' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao enviar mensagem. Tente novamente.'
    };
  }
};
