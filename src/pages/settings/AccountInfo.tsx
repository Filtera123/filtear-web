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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">账号信息</h1>
        <p className="text-gray-600">管理您的个人信息和基本资料</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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