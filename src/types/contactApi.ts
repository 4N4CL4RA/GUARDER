export interface ContactFormData {
  nome: string;
  email: string;
  mensagem: string;
  // Adicione outros campos conforme necessário
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
