import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type ContactFormData } from "@/services/contactApi";
import { sendContactMessage } from "@/services/contactSupabase";
import { motion } from "framer-motion";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    mensagem: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres que não são números
    const value = e.target.value.replace(/\D/g, '');
    
    // Aplica máscara de telefone brasileiro (11) 99999-9999
    let formattedValue = value;
    if (value.length >= 2) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length >= 7) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (value.length <= 11) {
      setFormData(prev => ({ ...prev, telefone: formattedValue }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha o campo Nome.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha o campo E-mail.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.email.includes('@')) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.mensagem.trim()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha o campo Mensagem.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Envia os dados usando o serviço real
      const result = await sendContactMessage(formData);
      
      if (result.success) {
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Obrigado pelo contato. Responderemos em breve.",
          variant: "default",
        });
        
        // Limpa o formulário
        setFormData({
          nome: "",
          sobrenome: "",
          email: "",
          telefone: "",
          mensagem: ""
        });
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full animate-pulse-slow"></div>
      </div>

      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-3 p-3 rounded-full card-iridescent mb-6">
              <Mail className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Fale Conosco</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tem dúvidas ou precisa de ajuda? Estamos aqui para você. Entre em contato conosco.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="card-iridescent p-8 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold gradient-text">Envie uma mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Nome *</label>
                      <Input 
                        name="nome"
                        placeholder="Seu nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Sobrenome</label>
                      <Input 
                        name="sobrenome"
                        placeholder="Seu sobrenome"
                        value={formData.sobrenome}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">E-mail *</label>
                    <Input 
                      name="email"
                      type="email" 
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Telefone</label>
                    <Input 
                      name="telefone"
                      type="tel" 
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Mensagem *</label>
                    <Textarea 
                      name="mensagem"
                      placeholder="Como podemos ajudar você?"
                      className="min-h-32"
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="default" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="card-iridescent p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-rose to-lilac rounded-2xl flex items-center justify-center">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">E-mail</h3>
                      <p className="text-muted-foreground">contato@guarder.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-iridescent p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-ocean to-mint rounded-2xl flex items-center justify-center">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Telefone</h3>
                      <p className="text-muted-foreground">+55 (11) 99999-9999</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-iridescent p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-lilac to-ocean rounded-2xl flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Endereço</h3>
                      <p className="text-muted-foreground">
                        Uberaba, MG<br />Brasil
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* FAQ */}
              <Card className="card-iridescent p-8 rounded-3xl">
                <CardHeader>
                  <CardTitle className="gradient-text">Perguntas Frequentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Como funciona o GUARDER?</h4>
                    <p className="text-sm text-muted-foreground">
                      O GUARDER monitora seus trajetos em tempo real e compartilha sua localização com contatos de confiança.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">É seguro?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim! Utilizamos criptografia de ponta a ponta e tecnologia de segurança avançada.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactSection;