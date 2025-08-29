// Configurações do Mapbox customizado
export const MAPBOX_CONFIG = {
  // Token público do Mapbox
  accessToken: "pk.eyJ1IjoiYW5hYWNsYXIiLCJhIjoiY21mcmllYjEzMDlvZDJrcHpmZ3Z2MzcyZCJ9.gG9u9uBioEFzqNVYG3jqOw",
  
  // Estilo personalizado
  styleUrl: "mapbox://styles/anaaclar/cmfrkislt008s01s0gf0raa0g",
  
  // Configurações iniciais do mapa (baseadas no style.json)
  initialView: {
    longitude: -46.6333, // São Paulo
    latitude: -23.5505,  // São Paulo
    zoom: 12,
    pitch: 0,
    bearing: 0
  },
  
  // Configurações avançadas
  settings: {
    projection: "globe" as const,
    antialias: true,
    optimizeForTerrain: true,
    
    // Configurações de atmosfera/fog
    fog: {
      'range': [0.5, 10],
      'color': 'white',
      'high-color': '#add8e6',
      'space-color': '#d8f2ff'
    },
    
    // Configurações de terreno
    terrain: {
      source: "mapbox-dem",
      exaggeration: 1.5
    },
    
    // Configurações de iluminação (baseadas no style.json)
    lightPreset: "day"
  },
  
  // Sprites customizados (imagens da pasta sprite_images)
  customSprites: {
    baseUrl: "/mapbox/sprite_images/",
    icons: [
      "arrow", "bicycle", "building", "bus", "cafe", "car",
      "circle-stroked", "circle", "cross", "diamond", "grocery",
      "heart", "home", "jewelry-store", "parking", "restaurant",
      "rocket", "shop", "square", "star", "suitcase", "triangle"
    ]
  }
};

export default MAPBOX_CONFIG;