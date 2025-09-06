// API连接测试组件

import React, { useState } from 'react';
import { Button, Alert, Box, Typography } from '@mui/material';
import { API_CONFIG, getApiUrl } from '../config/api';

export const ApiTestButton: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    details?: any;
  }>({
    status: 'idle',
    message: '',
  });

  const testApiConnection = async () => {
    setTestResult({ status: 'testing', message: '正在测试连接...' });

    try {
      // 测试基础连接
      const testUrl = getApiUrl('/health'); // 通常后端会有健康检查接口
      
      console.log('🧪 测试API连接:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({
          status: 'success',
          message: '后端连接成功！',
          details: {
            status: response.status,
            url: testUrl,
            data: data,
          },
        });
      } else {
        setTestResult({
          status: 'error',
          message: `连接失败: HTTP ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            url: testUrl,
          },
        });
      }
    } catch (error) {
      console.error('❌ API连接测试失败:', error);
      setTestResult({
        status: 'error',
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
        details: {
          error: error,
          url: getApiUrl('/health'),
        },
      });
    }
  };

  // 测试文件上传接口（不实际上传文件）
  const testUploadEndpoint = async () => {
    setTestResult({ status: 'testing', message: '正在测试上传接口...' });

    try {
      const uploadUrl = getApiUrl(API_CONFIG.ENDPOINTS.FILE_UPLOAD);
      
      console.log('🧪 测试上传接口:', uploadUrl);
      
      // 发送一个空的OPTIONS请求，检查CORS和接口可用性
      const response = await fetch(uploadUrl, {
        method: 'OPTIONS',
      });

      setTestResult({
        status: 'success',
        message: '上传接口可达！',
        details: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          url: uploadUrl,
        },
      });
    } catch (error) {
      console.error('❌ 上传接口测试失败:', error);
      setTestResult({
        status: 'error',
        message: `上传接口不可达: ${error instanceof Error ? error.message : '未知错误'}`,
        details: {
          error: error,
          url: getApiUrl(API_CONFIG.ENDPOINTS.FILE_UPLOAD),
        },
      });
    }
  };

  const getStatusColor = () => {
    switch (testResult.status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'testing': return 'info';
      default: return 'info';
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom>
        🔧 API连接测试
      </Typography>
      
      <Typography variant="body2" color="textSecondary" gutterBottom>
        当前后端地址: <code>{API_CONFIG.BASE_URL}</code>
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={testApiConnection}
          disabled={testResult.status === 'testing'}
          size="small"
        >
          {testResult.status === 'testing' ? '测试中...' : '测试基础连接'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={testUploadEndpoint}
          disabled={testResult.status === 'testing'}
          size="small"
        >
          {testResult.status === 'testing' ? '测试中...' : '测试上传接口'}
        </Button>
      </Box>

      {testResult.message && (
        <Alert severity={getStatusColor()} sx={{ mb: 1 }}>
          {testResult.message}
        </Alert>
      )}

      {testResult.details && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="textSecondary">
            详细信息:
          </Typography>
          <Box
            component="pre"
            sx={{
              fontSize: 12,
              backgroundColor: '#f0f0f0',
              p: 1,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 200,
            }}
          >
            {JSON.stringify(testResult.details, null, 2)}
          </Box>
        </Box>
      )}

      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
        💡 如果连接失败，请检查 <code>src/config/api.ts</code> 中的 BASE_URL 配置
      </Typography>
    </Box>
  );
};

