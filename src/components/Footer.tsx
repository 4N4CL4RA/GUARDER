import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  const footerSections = [
    {
      title: "Produto",
      links: [
        { name: "Como Funciona", href: "#how-it-works" },
        { name: "Recursos", href: "#resources" },
        { name: "Preços", href: "#" },
        { name: "Atualizações", href: "#" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "#about" },
        { name: "Carreiras", href: "#" },
        { name: "Imprensa", href: "#" },
        { name: "Parceiros", href: "#" }
      ]
    },
    {
      title: "Suporte",
      links: [
        { name: "Central de Ajuda", href: "#" },
        { name: "Contato", href: "#" },
        { name: "Status do Sistema", href: "#" },
        { name: "Relatórios de Bug", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Política de Privacidade", href: "#" },
        { name: "Termos de Uso", href: "#" },
        { name: "Cookies", href: "#" },
        { name: "Conformidade", href: "#" }
      ]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-lilac to-ocean animate-pulse-glow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold gradient-text">GUARDER</span>
            </div>
            
            <p className="text-background/80 leading-relaxed mb-6 max-w-md">
              Tecnologia de segurança que protege pessoas vulneráveis durante deslocamentos, 
              oferecendo monitoramento 24/7 e resposta rápida em emergências.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-background/80">
                <Mail className="w-5 h-5" />
                <span className="text-sm">contato@guarder.com.br</span>
              </div>
              <div className="flex items-center space-x-3 text-background/80">
                <Phone className="w-5 h-5" />
                <span className="text-sm">0800 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 text-background/80">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Uberaba, MG - Brasil</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-background mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-background/80 hover:text-background transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-background/20 pt-12 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-background mb-4">
                Siga-nos nas redes sociais
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-lilac/20 to-ocean/20 border border-background/20 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <social.icon className="w-5 h-5 text-background/80" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-background mb-4">
                Newsletter
              </h4>
              <p className="text-background/80 text-sm mb-4">
                Receba atualizações sobre segurança e novos recursos.
              </p>
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-4 py-3 rounded-xl bg-background/10 border border-background/20 text-background placeholder-background/60 focus:outline-none focus:ring-2 focus:ring-lilac"
                />
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-lilac to-ocean text-white font-semibold hover:scale-105 transition-transform">
                  Inscrever
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/80 text-sm">
              © 2025 GUARDER. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-background/80">Certificações:</span>
              <div className="flex items-center space-x-4">
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-lilac/20 to-ocean/20 border border-background/20 text-background/80">
                  ISO 27001
                </div>
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-ocean/20 to-rose/20 border border-background/20 text-background/80">
                  LGPD
                </div>
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-rose/20 to-mint/20 border border-background/20 text-background/80">
                  SOC 2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;