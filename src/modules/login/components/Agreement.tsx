// 用户协议组件

import React from 'react';
import { FormControlLabel, Checkbox, Typography, Link } from '@mui/material';

interface AgreementProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const Agreement: React.FC<AgreementProps> = ({
  checked,
  onChange,
  error,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const linkStyle = {
    color: '#8b5cf6',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  };

  return (
    <div className="space-y-2">
      <FormControlLabel
        control={
                      <Checkbox
              checked={checked}
              onChange={handleChange}
              size="small"
              sx={{
                color: error ? '#ff4d4f' : '#8b5cf6',
                '&.Mui-checked': {
                  color: '#8b5cf6',
                },
              }}
            />
        }
        label={
          <Typography variant="body2" className="text-gray-600 text-xs leading-5">
            我已阅读并同意
            <Link
              href="#"
              sx={linkStyle}
              onClick={(e) => {
                e.preventDefault();
                // 这里可以打开服务协议弹窗或跳转页面
                console.log('打开服务协议');
              }}
            >
              《服务协议》
            </Link>
            、
            <Link
              href="#"
              sx={linkStyle}
              onClick={(e) => {
                e.preventDefault();
                // 这里可以打开隐私政策弹窗或跳转页面
                console.log('打开隐私政策');
              }}
            >
              《隐私政策》
            </Link>
            和
            <Link
              href="#"
              sx={linkStyle}
              onClick={(e) => {
                e.preventDefault();
                // 这里可以打开儿童保护协议弹窗或跳转页面
                console.log('打开儿童保护协议');
              }}
            >
              《儿童保护协议》
            </Link>
          </Typography>
        }
        className="items-start"
      />
      
      {error && (
        <Typography variant="caption" className="text-red-500 ml-8">
          {error}
        </Typography>
      )}
    </div>
  );
}; 