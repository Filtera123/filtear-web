import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Menu, MenuItem, Typography, Box } from '@mui/material';
import { IconUser, IconLogout, IconSettings } from '@tabler/icons-react';
import { useLoginStore } from '../modules/login/store/loginStore';

export const AuthButton: React.FC = () => {
  const navigate = useNavigate();
  const { isLogin, userInfo, checkLoginStatus, logout } = useLoginStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // 组件挂载时检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    if (userInfo) {
      navigate(`/user/${userInfo.userId}`);
    }
    handleMenuClose();
  };

  if (!isLogin || !userInfo) {
    return (
      <Button
        variant="contained"
        onClick={handleLogin}
        sx={{
          backgroundColor: '#7E44C6',
          color: 'white',
          '&:hover': {
            backgroundColor: '#6D38B1',
          },
          borderRadius: '20px',
          padding: '8px 20px',
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        登录
      </Button>
    );
  }

  return (
    <Box className="flex items-center space-x-2">
      <Button
        onClick={handleMenuOpen}
        className="flex items-center space-x-2 bg-white hover:bg-gray-50 rounded-full p-2"
        sx={{
          textTransform: 'none',
          color: '#333',
          minWidth: 'auto',
        }}
      >
        <Avatar
          src={userInfo.avatar}
          alt={userInfo.nickname}
          sx={{ width: 32, height: 32 }}
        >
          {userInfo.nickname?.charAt(0)}
        </Avatar>
        <Typography variant="body2" className="hidden sm:block font-medium">
          {userInfo.nickname}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={handleProfile} className="flex items-center space-x-2">
          <IconUser size={18} />
          <span>个人主页</span>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="flex items-center space-x-2">
          <IconSettings size={18} />
          <span>设置</span>
        </MenuItem>
        <MenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
          <IconLogout size={18} />
          <span>退出登录</span>
        </MenuItem>
      </Menu>
    </Box>
  );
};
