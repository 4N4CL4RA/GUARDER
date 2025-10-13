import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useToast } from '../hooks/use-toast'
import { supabase } from '../lib/supabaseClient'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar,
  Settings,
  Camera,
  Edit3,
  Save,
  X,
  Award,
  Star,
  Activity,
  Bell,
  Lock,
  Trash2
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'

export default function PerfilPage() {
  const { isLoggedIn, loading, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    nome: 'Ana Clara', // Dados padrão para teste
    sobrenome: 'Silva', // Dados padrão para teste
    email: 'ana.clara@email.com', // Dados padrão para teste
    telefone: '(11) 99999-9999', // Dados padrão para teste
    bio: 'Viajante apaixonada por lugares seguros e experiências autênticas. Sempre em busca de hotéis e pousadas que ofereçam segurança e conforto.',
    localizacao: 'São Paulo, SP',
    dataNascimento: '1995-03-15'
  })

  // Debug: verificar dados no localStorage
  useEffect(() => {
    console.log('=== DEBUG PERFIL ===')
    console.log('User from useAuth:', user)
    console.log('localStorage userData:', localStorage.getItem('userData'))
    console.log('isLoggedIn:', isLoggedIn)
    console.log('loading:', loading)
  }, [user, isLoggedIn, loading])

  const loadUserAvatar = useCallback(async () => {
    if (!user?.id) return
    
    try {
      // Primeiro tenta carregar do localStorage
      const avatarKey = `avatar_${user.id}`
      const localAvatar = localStorage.getItem(avatarKey)
      
      if (localAvatar) {
        setAvatarUrl(localAvatar)
        return
      }
      
      // Se não tiver no localStorage, tenta do Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()
      
      if (data?.avatar_url && !error) {
        setAvatarUrl(data.avatar_url)
        // Salva no localStorage para cache
        localStorage.setItem(avatarKey, data.avatar_url)
      }
    } catch (error) {
      console.error('Erro ao carregar avatar:', error)
    }
  }, [user?.id])

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login')
    }
    
    // Atualiza os dados do formulário quando o usuário é carregado
    if (user) {
      console.log('User data loaded:', user) // Debug
      setFormData(prev => ({
        ...prev,
        nome: user.nome || prev.nome,
        sobrenome: user.sobrenome || prev.sobrenome,
        email: user.email || prev.email, // Email do cadastro - não editável
        telefone: user.telefone || prev.telefone,
      }))
      
      // Carrega avatar do usuário se existir
      loadUserAvatar()
    } else if (isLoggedIn && !loading) {
      // Fallback: carregar dados diretamente do localStorage
      try {
        const userDataString = localStorage.getItem('userData')
        if (userDataString) {
          const userData = JSON.parse(userDataString)
          console.log('Fallback: Loading from localStorage:', userData)
          setFormData(prev => ({
            ...prev,
            nome: userData.nome || prev.nome,
            sobrenome: userData.sobrenome || prev.sobrenome,
            email: userData.email || prev.email,
            telefone: userData.telefone || prev.telefone,
          }))
        }
      } catch (error) {
        console.error('Erro ao parsear dados do localStorage:', error)
      }
    }
  }, [isLoggedIn, loading, navigate, user, loadUserAvatar])

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return

    setUploading(true)
    try {
      // Converter imagem para base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64String = e.target?.result as string
        
        // Salvar no localStorage por enquanto (solução temporária)
        const avatarKey = `avatar_${user.id}`
        localStorage.setItem(avatarKey, base64String)
        
        // Tentar salvar no Supabase (se disponível)
        try {
          await supabase
            .from('profiles')
            .upsert({ 
              id: user.id,
              avatar_url: base64String,
              email: user.email 
            })
        } catch (dbError) {
          console.warn('Erro ao salvar no banco, usando localStorage:', dbError)
        }

        setAvatarUrl(base64String)
        setUploading(false)
        toast({
          title: "Sucesso!",
          description: "Foto de perfil atualizada com sucesso.",
        })
      }
      
      reader.onerror = () => {
        setUploading(false)
        toast({
          title: "Erro",
          description: "Erro ao processar a imagem.",
          variant: "destructive",
        })
      }
      
      reader.readAsDataURL(file)
      
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      setUploading(false)
      toast({
        title: "Erro",
        description: "Erro ao atualizar foto de perfil.",
        variant: "destructive",
      })
    }
  }

  const handleAvatarClick = () => {
    console.log('Avatar clicked, opening file selector')
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed')
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type)
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        })
        return
      }
      
      // Validar tamanho do arquivo
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        })
        return
      }
      
      uploadAvatar(file)
    }
    
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    event.target.value = ''
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Aqui seria implementada a lógica para salvar os dados
    console.log('Salvando dados:', formData)
    setIsEditing(false)
  }

  const getInitials = (nome: string, sobrenome: string) => {
    return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase()
  }

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

      <Navigation isLoggedIn={isLoggedIn} />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 backdrop-blur-sm shadow-xl mb-8">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">Meu Perfil</h1>
                <p className="text-sm text-muted-foreground">Área pessoal do usuário</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gerencie suas informações pessoais e configurações de conta de forma segura
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Profile Card - Left Column */}
            <div className="lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="card-iridescent text-center overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 h-20"></div>
                  <CardContent className="p-6 -mt-10">
                    <div className="relative inline-block mb-6">
                      <Avatar className="w-20 h-20 mx-auto cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg border-4 border-white" onClick={handleAvatarClick}>
                        <AvatarImage src={avatarUrl} alt="Foto do perfil" />
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(formData.nome, formData.sobrenome)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg border-2 border-white"
                        onClick={handleAvatarClick}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    <h2 className="text-xl font-bold gradient-text mb-3">
                      {formData.nome} {formData.sobrenome}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{formData.localizacao}</span>
                    </div>
                    <div className="flex justify-center gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                        <Shield className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm">
                        <Award className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed px-2">
                      {formData.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="card-iridescent">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="w-4 h-4" />
                      Estatísticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    {[
                      { label: 'Avaliações', value: '42', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
                      { label: 'Viagens', value: '28', icon: MapPin, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
                      { label: 'Pontos', value: '1,250', icon: Award, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
                      { label: 'Membro desde', value: 'Jan 2024', icon: Calendar, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' }
                    ].map((stat, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${stat.bgColor} hover:scale-105 transition-transform`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                          <span className="text-sm font-medium">{stat.label}</span>
                        </div>
                        <span className="font-bold text-sm">{stat.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content - Right Columns */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="card-iridescent">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informações Pessoais
                    </CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={`flex items-center gap-2 transition-all ${isEditing ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          Editar
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="nome">Nome</Label>
                        {isEditing ? (
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => handleInputChange('nome', e.target.value)}
                            className="bg-white/70 dark:bg-gray-800/70 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        ) : (
                          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-4 border-blue-500 text-sm font-medium">
                            {formData.nome}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="sobrenome">Sobrenome</Label>
                        {isEditing ? (
                          <Input
                            id="sobrenome"
                            value={formData.sobrenome}
                            onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                            className="bg-white/70 dark:bg-gray-800/70 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                          />
                        ) : (
                          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500 text-sm font-medium">
                            {formData.sobrenome}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email <span className="text-xs text-muted-foreground">(não editável)</span>
                      </Label>
                      <div className="p-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-l-4 border-gray-400 text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {formData.email}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="telefone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </Label>
                      {isEditing ? (
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          className="bg-white/70 dark:bg-gray-800/70 border-2 border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        />
                      ) : (
                        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 text-sm font-medium">
                          {formData.telefone}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="bg-white/70 dark:bg-gray-800/70 border-2 border-amber-200 dark:border-amber-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all min-h-24"
                          placeholder="Conte um pouco sobre você..."
                        />
                      ) : (
                        <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 text-sm leading-relaxed">
                          {formData.bio}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 pt-2"
                      >
                        <Button 
                          onClick={handleSave} 
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

                </div>

                {/* Configurações - Segunda coluna */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Settings */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card className="card-iridescent">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Configurações
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          {
                            icon: Bell,
                            title: 'Notificações',
                            description: 'Gerencie suas preferências de notificação',
                            action: 'Configurar',
                            color: 'text-blue-500',
                            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                            borderColor: 'border-blue-200 dark:border-blue-800'
                          },
                          {
                            icon: Lock,
                            title: 'Privacidade e Segurança',
                            description: 'Controle quem pode ver suas informações',
                            action: 'Gerenciar',
                            color: 'text-purple-500',
                            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                            borderColor: 'border-purple-200 dark:border-purple-800'
                          },
                          {
                            icon: Shield,
                            title: 'Verificação de Conta',
                            description: 'Adicione camadas extras de segurança',
                            action: 'Verificar',
                            color: 'text-green-500',
                            bgColor: 'bg-green-50 dark:bg-green-900/20',
                            borderColor: 'border-green-200 dark:border-green-800'
                          }
                        ].map((setting, index) => (
                          <motion.div 
                            key={index} 
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center justify-between p-4 rounded-lg ${setting.bgColor} border ${setting.borderColor} hover:shadow-md transition-all`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                                <setting.icon className={`w-4 h-4 ${setting.color}`} />
                              </div>
                              <div>
                                <h3 className="font-medium text-sm">{setting.title}</h3>
                                <p className="text-xs text-muted-foreground">{setting.description}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`hover:${setting.bgColor} hover:${setting.borderColor} hover:${setting.color} text-xs`}
                            >
                              {setting.action}
                            </Button>
                          </motion.div>
                        ))}

                        <Separator className="my-6 opacity-30" />

                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm text-red-700 dark:text-red-300">Excluir Conta</h3>
                              <p className="text-xs text-red-600 dark:text-red-400">
                                Esta ação não pode ser desfeita
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-xs"
                          >
                            Excluir
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}