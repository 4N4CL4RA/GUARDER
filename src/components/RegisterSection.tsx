import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/services/authApi";

export default function Register() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast({
        title: "Termos de uso",
        description: "Você deve aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Validar se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho mínimo da senha
    if (formData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Validar se o telefone tem o formato correto
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
        
        // Redirecionar para login após cadastro bem-sucedido
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999 apenas se tiver números suficientes
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

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Junte-se ao{" "}
                <span className="gradient-text">
                  GUARDER
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Crie sua conta e experimente a proteção mais avançada para seus dados e trajetos.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-bold gradient-text">24/7</div>
                <div className="text-xs sm:text-sm text-white/70">Monitoramento</div>
              </div>
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-bold gradient-text">100%</div>
                <div className="text-xs sm:text-sm text-white/70">Seguro</div>
              </div>
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-bold gradient-text">5★</div>
                <div className="text-xs sm:text-sm text-white/70">Avaliação</div>
              </div>
            </div>
          </div>

          {/* Right side - Register form */}
          <div className="flex justify-center order-1 lg:order-2">
            <Card className="w-full max-w-md card-iridescent backdrop-blur-md border-2 shadow-lg">
              <CardHeader className="space-y-4 text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Criar conta
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Cadastre-se para começar a usar o GUARDER
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-foreground">Nome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="nome"
                          type="text"
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => updateField("nome", e.target.value)}
                          className="pl-10 bg-background/50 border text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sobrenome" className="text-foreground">Sobrenome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="sobrenome"
                          type="text"
                          placeholder="Seu sobrenome"
                          value={formData.sobrenome}
                          onChange={(e) => updateField("sobrenome", e.target.value)}
                          className="pl-10 bg-background/50 border text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="pl-10 bg-background/50 border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-foreground">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="telefone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.telefone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                        className="pl-10 bg-background/50 border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="pl-10 pr-10 bg-background/50 border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="pl-10 pr-10 bg-background/50 border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
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
                      className="border data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      Aceito os{" "}
                      <Link to="#" className="text-primary hover:text-primary/80 transition-colors">
                        termos de uso
                      </Link>{" "}
                      e{" "}
                      <Link to="#" className="text-primary hover:text-primary/80 transition-colors">
                        política de privacidade
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="default"
                    disabled={isLoading || !formData.acceptTerms}
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link 
                      to="/login" 
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
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