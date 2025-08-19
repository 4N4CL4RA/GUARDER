import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Nome</label>
                    <Input placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Sobrenome</label>
                    <Input placeholder="Seu sobrenome" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">E-mail</label>
                  <Input type="email" placeholder="seu@email.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Telefone</label>
                  <Input type="tel" placeholder="(11) 99999-9999" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Mensagem</label>
                  <Textarea 
                    placeholder="Como podemos ajudar você?"
                    className="min-h-32"
                  />
                </div>
                
                <Button variant="default" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
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
                        Uberaba, MG<br />
                        Brasil
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