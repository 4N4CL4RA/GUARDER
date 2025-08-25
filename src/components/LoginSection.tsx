import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/services/authApi";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        
        // Redirecionar para dashboard após login bem-sucedido
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast({
          title: "Erro no login",
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

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Bem-vindo de volta ao{" "}
                <span className="gradient-text">
                  GUARDER
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Acesse sua conta e continue protegendo seus trajetos.
              </p>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex justify-center order-1 lg:order-2">
            <Card className="w-full max-w-md card-iridescent backdrop-blur-md border-2 shadow-lg">
              <CardHeader className="space-y-4 text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Entrar na sua conta
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Entre com suas credenciais para acessar o GUARDER
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <div className="flex items-center justify-between">
                    <Link 
                      to="#" 
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" variant="default" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link 
                      to="/register" 
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Cadastre-se
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
