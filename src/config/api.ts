// API配置文件

// 后端API基础地址配置
export const API_CONFIG = {
  // 开发环境 - 根据后端提供的地址修改
  // 🔧 配置说明：将 localhost 替换为实际的后端IP地址
  // 例如：'http://192.168.1.100:9300' 或 'http://10.0.0.1:9300'
  BASE_URL: 'http://localhost:9300',
  
  // 如果有多个环境，可以这样配置：
  // BASE_URL: process.env.NODE_ENV === 'production' 
  //   ? 'https://your-production-api.com'
  //   : 'http://localhost:9300',
  
  // API端点
  ENDPOINTS: {
    FILE_UPLOAD: '/api/file/upload',
    FILE_DOWNLOAD: '/api/file/download',
  },
  
  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // 超时时间
  TIMEOUT: 30000, // 30秒
};

/**
 * 获取完整的API URL
 * @param endpoint API端点路径
 * @returns 完整的API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * 获取带认证头的请求配置
 * @param additionalHeaders 额外的请求头
 * @returns 请求配置对象
 */
export function getAuthHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    ...additionalHeaders,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * 通用的fetch包装函数
 * @param endpoint API端点
 * @param options fetch选项
 * @returns Promise<Response>
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  // 合并默认配置
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };
  
  console.log('🚀 API请求:', url, config);
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    console.error('❌ API请求失败:', response.status, response.statusText);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response;
}
