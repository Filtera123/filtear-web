// 表单验证工具函数

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// 手机号验证
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: '请输入手机号' };
  }
  
  // 中国大陆手机号格式验证：+86开头 + 11位数字
  const phoneRegex = /^\+86\d{11}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: '请输入正确的手机号' };
  }
  
  return { isValid: true };
};

// 验证码验证
export const validateCode = (code: string): ValidationResult => {
  if (!code) {
    return { isValid: false, message: '请输入验证码' };
  }
  
  // 6位数字验证码
  const codeRegex = /^\d{6}$/;
  if (!codeRegex.test(code)) {
    return { isValid: false, message: '请输入6位验证码' };
  }
  
  return { isValid: true };
};

// 密码验证
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: '请输入密码' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: '密码长度不能少于6位' };
  }
  
  return { isValid: true };
};

// 图形验证码验证
export const validateCaptcha = (captcha: string): ValidationResult => {
  if (!captcha) {
    return { isValid: false, message: '请输入图形验证码' };
  }
  
  return { isValid: true };
};

// 协议勾选验证
export const validateAgreement = (agreed: boolean): ValidationResult => {
  if (!agreed) {
    return { isValid: false, message: '请阅读并同意相关协议' };
  }
  
  return { isValid: true };
};

// 格式化手机号显示（自动添加+86前缀）
export const formatPhoneNumber = (phone: string): string => {
  // 移除所有非数字字符
  const cleanPhone = phone.replace(/\D/g, '');
  
  // 如果以86开头，添加+号
  if (cleanPhone.startsWith('86') && cleanPhone.length === 13) {
    return `+${cleanPhone}`;
  }
  
  // 如果是11位数字，添加+86前缀
  if (cleanPhone.length === 11) {
    return `+86${cleanPhone}`;
  }
  
  // 如果已经有+86前缀，直接返回
  if (phone.startsWith('+86')) {
    return phone;
  }
  
  return phone;
};

// 清理手机号输入（只保留数字）
export const cleanPhoneInput = (phone: string): string => {
  return phone.replace(/\D/g, '');
}; 