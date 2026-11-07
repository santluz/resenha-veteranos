export interface Interview { id?: string; name: string; role: string; date: string; thumbnail: string; youtubeId: string; videoUrl?: string; description: string; }
export interface Highlight { id?: string; title: string; date: string; thumbnail?: string; youtubeId?: string; videoUrl?: string; description: string; }
export interface ArbitroVideo { id?: string; title: string; date: string; videoUrl: string; thumbnail?: string; description?: string; }
export interface LatestResenha { id?: string; youtubeId?: string; videoUrl?: string; title: string; date: string; description: string; matchStats: { goals: string; opponent: string; location: string; }; }
export interface GalleryPhoto { id?: string; src: string; alt: string; date: string; }
export interface NextMatch { date: string; time: string; location: string; }
export interface SiteConfig { instagram: string; logoUrl?: string; comunicado?: string; comunicadoAtivo?: boolean; primaryColor?: string; nomeGrupo?: string; }
