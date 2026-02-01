// Cliente HTTP genérico para comunicação com APIs externas via proxy Next.js
// Evita problemas de CORS usando rotas da API local

const API_BASE_URL = ''; // Usa proxy local em /api
const DEFAULT_TIMEOUT = 10000; // 10 segundos
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em ms

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + duration,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Limpa entradas expiradas
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new SimpleCache();

export interface ApiResponse<T> {
  dados: T[];
  links?: {
    self?: string;
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  endpoint?: string;
}

export class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    enableCache: boolean = false,
    cacheDuration?: number
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${url}${JSON.stringify(options)}`;

    // Verificar cache primeiro
    if (enableCache) {
      const cached = cache.get<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PoliticosBR/1.0 (CivicTech; +https://politicosbr.example.com)',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          endpoint,
        };
        throw error;
      }

      const data = await response.json();

      // Cachear resposta bem-sucedida
      if (enableCache) {
        cache.set(cacheKey, data, cacheDuration);
      }

      return data;
    } catch (error) {
      // Tratamento específico para abort
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Requisição expirou. Tente novamente.');
      }

      // Tratamento para erros de rede
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }

      // Repassar outros erros
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>,
    options: {
      enableCache?: boolean;
      cacheDuration?: number;
    } = {}
  ): Promise<T> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      url = queryString ? `${endpoint}?${queryString}` : endpoint;
    }

    return this.request<T>(url, {
      method: 'GET',
      ...options,
    }, options.enableCache, options.cacheDuration);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Limpeza de cache
  clearCache(): void {
    cache.clear();
  }

  // Limpeza de expirados
  cleanupCache(): void {
    cache.cleanup();
  }
}

// Instância global do cliente HTTP
export const httpClient = new HttpClient();

// Limpar cache expirados a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    httpClient.cleanupCache();
  }, CACHE_DURATION);
}