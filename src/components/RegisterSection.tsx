import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/services/authApi";

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    updateField("telefone", formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações antes do envio
    if (!formData.acceptTerms) {
      toast({
        title: "Termos de uso",
        description: "Você deve aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const phoneNumbers = formData.telefone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      toast({
        title: "Telefone inválido",
        description: "Digite um telefone válido com DDD.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser(formData);
      if (result.success) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Agora você pode fazer login com suas credenciais.",
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  // Validação dos campos da primeira etapa

  // Função para validar email
  const isValidEmail = (email: string) => {
    // Regex simples para validação de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStep1Valid =
    formData.nome.trim() !== "" &&
    formData.sobrenome.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.telefone.replace(/\D/g, "").length >= 10;

  const handleNextStep = () => {
    if (formData.nome.trim() === "" || formData.sobrenome.trim() === "" || formData.telefone.replace(/\D/g, "").length < 10) {
      toast({
        title: "Preencha todos os campos",
        description: "Por favor, preencha todos os campos obrigatórios corretamente para avançar.",
        variant: "destructive",
      });
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Digite um email válido para avançar.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Junte-se ao <span className="gradient-text">GUARDER</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Crie sua conta e experimente a proteção mais avançada para seus dados e trajetos.
            </p>
          </div>

          {/* Right side - Multi-step form */}
          <div className="flex justify-center order-1 lg:order-2">
            <Card className="w-full max-w-md card-iridescent backdrop-blur-md border-2 shadow-lg">
              <CardHeader className="space-y-4 text-center">
                <CardTitle className="text-2xl font-bold text-foreground">Criar conta</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {step === 1 ? "Preencha seus dados pessoais" : "Defina sua senha e aceite os termos"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="nome"
                              type="text"
                              placeholder="Seu nome"
                              value={formData.nome}
                              onChange={(e) => updateField("nome", e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="sobrenome">Sobrenome</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="sobrenome"
                              type="text"
                              placeholder="Seu sobrenome"
                              value={formData.sobrenome}
                              onChange={(e) => updateField("sobrenome", e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="telefone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={formData.telefone}
                            onChange={handlePhoneChange}
                            maxLength={15}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="button" onClick={handleNextStep} className="w-full" disabled={!isStep1Valid}>
                        Próximo <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirmar senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField("confirmPassword", e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => updateField("acceptTerms", checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground">
                          Aceito os{" "}
                          <Link to="#" className="text-primary hover:text-primary/80">termos de uso</Link> e{" "}
                          <Link to="#" className="text-primary hover:text-primary/80">política de privacidade</Link>
                        </Label>
                      </div>

                      <div className="flex justify-between gap-2">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1" 
                          disabled={isLoading || !formData.acceptTerms}
                        >
                          {isLoading ? "Criando conta..." : "Criar conta"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                      Entrar
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
