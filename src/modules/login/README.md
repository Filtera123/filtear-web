# 登录模块

这是一个基于React + TypeScript + Material-UI + Zustand开发的完整登录模块。

## 功能特性

- ✅ **双登录方式**：支持短信验证码登录和密码登录
- ✅ **表单验证**：完整的表单验证和错误提示
- ✅ **图形验证码**：可选的图形验证码功能
- ✅ **短信验证码**：60秒倒计时功能
- ✅ **用户协议**：服务协议、隐私政策等链接
- ✅ **状态持久化**：使用Zustand持久化登录状态
- ✅ **响应式设计**：适配移动端和桌面端
- ✅ **Mock数据**：开发阶段使用模拟数据

## 快速开始

### 1. 导入登录组件

```tsx
import { Login } from '@/modules/login';

// 在你的路由中使用
<Route path="/login" element={<Login />} />
```

### 2. 使用认证状态

```tsx
import { useLoginStore } from '@/modules/login';

function MyComponent() {
  const { isLogin, userInfo, logout } = useLoginStore();
  
  if (isLogin) {
    return <div>欢迎，{userInfo?.nickname}</div>;
  }
  
  return <div>请先登录</div>;
}
```

### 3. 调用API

```tsx
import { loginApi } from '@/modules/login';

// 发送短信验证码
const success = await loginApi.sendSms({
  phone: '+8613800138000'
});

// 验证码登录
const response = await loginApi.smsLogin({
  phone: '+8613800138000',
  code: '123456'
});
```

## 文件结构

```
login/
├── Login.tsx              # 主登录组件
├── components/            # 子组件
│   ├── Captcha.tsx       # 图形验证码
│   └── Agreement.tsx     # 用户协议
├── api/                  # API相关
│   ├── index.ts         # API接口
│   └── types.ts         # 类型定义
├── store/               # 状态管理
│   └── loginStore.ts    # Zustand Store
├── styles/              # 样式文件
│   └── login.css        # CSS样式
├── utils/               # 工具函数
│   └── validate.ts      # 表单验证
├── index.ts             # 统一导出
└── README.md            # 说明文档
```

## 开发测试

### 测试账号
- 手机号：任意 +86 开头的11位数字
- 验证码：`123456`
- 密码：`123456`

### 验证流程

1. **验证码登录**：
   - 输入手机号（自动格式化为+86格式）
   - 点击"获取验证码"（倒计时60秒）
   - 输入验证码 `123456`
   - 勾选协议
   - 点击"登录/注册"

2. **密码登录**：
   - 切换到"密码登录"Tab
   - 输入手机号和密码 `123456`
   - 勾选协议
   - 点击"登录"

## 自定义配置

### 修改主题色

在 `styles/login.css` 中修改主题颜色：

```css
:root {
  --primary-color: #00cc99;    /* 主题色 */
  --primary-hover: #00b386;    /* 悬停色 */
}
```

### 修改验证规则

在 `utils/validate.ts` 中自定义验证规则：

```tsx
export const validatePhone = (phone: string): ValidationResult => {
  // 自定义手机号验证逻辑
};
```

### 接入真实API

替换 `api/index.ts` 中的模拟数据为真实API调用：

```tsx
export const sendSms = async (params: SendSmsRequest) => {
  const response = await fetch('/api/sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
};
```

## 注意事项

1. **安全性**：生产环境请确保使用HTTPS
2. **验证码**：真实环境需接入短信服务商
3. **图形验证码**：建议根据业务需求决定是否启用
4. **错误处理**：请完善网络异常和业务错误的处理逻辑
5. **国际化**：如需支持多语言，请使用i18n库

## 技术栈

- **React 19.1.0**
- **TypeScript**
- **Material-UI 7.1.1**
- **Zustand 5.0.6**
- **React Router DOM 7.6.1**
- **Tailwind CSS**

## 兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 移动端浏览器 