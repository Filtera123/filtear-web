import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Box, 
  Divider 
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface AccountInfoForm {
  nickname: string;
  bio: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  province: string;
  city: string;
  realName: string;
  phone: string;
}

export default function AccountInfo() {
  const { control, handleSubmit, watch } = useForm<AccountInfoForm>({
    defaultValues: {
      nickname: '用户昵称',
      bio: '',
      gender: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      province: '',
      city: '',
      realName: '',
      phone: ''
    }
  });

  const onSubmit = (data: AccountInfoForm) => {
    console.log('提交账号信息:', data);
    // 这里处理表单提交逻辑
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">编辑资料</h1>
        <p className="text-gray-600">管理您的个人信息、头像和封面图</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 个人形象 */}
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              个人形象
            </Typography>
            
            <div className="space-y-6">
              {/* 头像上传 */}
              <div>
                <Typography variant="body2" className="mb-2 font-medium">
                  头像
                </Typography>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                    {watch('nickname') && (
                      <img 
                        src={`https://picsum.photos/id/64/100/100`} 
                        alt="用户头像" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outlined" size="small">
                      上传头像
                    </Button>
                    <Typography variant="caption" className="block text-gray-500">
                      支持 JPG、PNG 格式，最大 5MB
                    </Typography>
                  </div>
                </div>
              </div>

              {/* 背景图片上传 */}
              <div>
                <Typography variant="body2" className="mb-2 font-medium">
                  个人主页背景
                </Typography>
                <div className="flex flex-col space-y-3">
                  <div className="w-full h-32 rounded-md border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                    <img 
                      src={`https://picsum.photos/id/29/800/300`} 
                      alt="背景图片" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outlined" size="small">
                      上传背景图
                    </Button>
                    <Button variant="text" size="small" color="error">
                      移除背景图
                    </Button>
                  </div>
                  <Typography variant="caption" className="text-gray-500">
                    推荐尺寸 1500×500 像素，支持 JPG、PNG 格式，最大 10MB
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 基础信息 */}
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              基础信息
            </Typography>
            
            <div className="space-y-4">
              <Controller
                name="nickname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="昵称"
                    fullWidth
                    variant="outlined"
                    size="small"
                    helperText="您的显示名称，其他用户将看到此名称"
                  />
                )}
              />
              
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="简介"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="介绍一下自己吧..."
                    helperText="简要介绍自己，让其他用户更好地了解您"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 个人资料 */}
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              个人资料
            </Typography>
            
            <div className="space-y-4">
              {/* 性别选择 */}
              <div>
                <Typography variant="body2" className="mb-2 font-medium">
                  性别
                </Typography>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel 
                        value="female" 
                        control={<Radio size="small" />} 
                        label="女" 
                      />
                      <FormControlLabel 
                        value="male" 
                        control={<Radio size="small" />} 
                        label="男" 
                      />
                      <FormControlLabel 
                        value="other" 
                        control={<Radio size="small" />} 
                        label="其他" 
                      />
                    </RadioGroup>
                  )}
                />
              </div>

              {/* 生日 */}
              <div>
                <Typography variant="body2" className="mb-2 font-medium">
                  生日
                </Typography>
                <Box className="flex space-x-2">
                  <Controller
                    name="birthYear"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="年"
                        type="number"
                        size="small"
                        style={{ width: '100px' }}
                        inputProps={{ min: 1900, max: new Date().getFullYear() }}
                      />
                    )}
                  />
                  <Controller
                    name="birthMonth"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="月"
                        type="number"
                        size="small"
                        style={{ width: '80px' }}
                        inputProps={{ min: 1, max: 12 }}
                      />
                    )}
                  />
                  <Controller
                    name="birthDay"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="日"
                        type="number"
                        size="small"
                        style={{ width: '80px' }}
                        inputProps={{ min: 1, max: 31 }}
                      />
                    )}
                  />
                </Box>
              </div>

              {/* 地区 */}
              <div>
                <Typography variant="body2" className="mb-2 font-medium">
                  地区
                </Typography>
                <Box className="flex space-x-2">
                  <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="省/直辖市"
                        size="small"
                        style={{ flex: 1 }}
                      />
                    )}
                  />
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="市/区"
                        size="small"
                        style={{ flex: 1 }}
                      />
                    )}
                  />
                </Box>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 身份认证 */}
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              身份认证
            </Typography>
            
            <div className="space-y-4">
              <Controller
                name="realName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="真实姓名"
                    fullWidth
                    variant="outlined"
                    size="small"
                    helperText="用于身份验证，不会公开显示"
                  />
                )}
              />
              
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="手机号"
                    fullWidth
                    variant="outlined"
                    size="small"
                    helperText="用于账号安全验证和找回密码"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex justify-end space-x-3">
          <Button variant="outlined" color="inherit">
            取消
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ backgroundColor: '#8b5cf6', '&:hover': { backgroundColor: '#7c3aed' } }}
          >
            保存更改
          </Button>
        </div>
      </form>
    </div>
  );
} 