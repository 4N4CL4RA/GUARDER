import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type ContactFormData } from "@/services/contactApi";
import { sendContactMessage } from "@/services/contactSupabase";

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
    <section className="py-20 lg:py-32 bg-background min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold gradient-text mb-6">
            Entre em Contato
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tem dúvidas ou precisa de ajuda? Estamos aqui para você. Entre em contato conosco.
          </p>
        </div>

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
    </section>
  );
};

export default ContactSection;