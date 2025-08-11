# 工具函数库

## IP地址相关工具 (`ipLocation.ts`)

### 功能描述
提供IP地址位置信息的格式化和处理功能，支持国内外IP地址的标准化显示。

### 核心函数

#### `formatIpLocation(ipLocation?: string): string`
格式化IP地址位置信息，添加"IP属地："前缀
- **用途**: 用户个人主页IP地址显示
- **示例**: `formatIpLocation('北京')` → `'IP属地：北京'`

#### `getSimpleLocation(ipLocation?: string): string`
获取简化的位置信息，不含前缀
- **用途**: 帖子详情页和评论中的IP地址显示
- **示例**: `getSimpleLocation('北京')` → `'北京'`

#### `isChineseIp(ipLocation?: string): boolean`
判断是否为国内IP地址
- **用途**: 区分国内外用户

### 显示规则
- **国内地址**: 精确到省份（北京、上海、广东等）
- **国外地址**: 精确到国家（美国、日本、韩国等）
- **未知地址**: 显示"IP属地未知"

---

## 模拟数据生成工具 (`mockData.ts`)

### 功能描述
为开发和测试提供一致性的模拟数据生成功能，包括IP地址、用户信息、帖子和评论数据。

### IP地址池
内置50+个国内外IP地址：
- **国内**: 34个省市自治区
- **国外**: 20个主要国家

### 核心函数

#### `getRandomIpLocation(index?: number): string`
获取随机IP地址
- **参数**: `index` - 可选索引，相同索引返回相同IP
- **用途**: 生成一致性的测试数据

#### `withAuthorIp<T>(post: T, index?: number): T & { authorIpLocation: string }`
为帖子添加作者IP地址
- **用途**: 帖子模拟数据生成

#### `withUserIp<T>(comment: T, index?: number): T & { userIpLocation: string }`
为评论添加用户IP地址
- **用途**: 评论模拟数据生成

#### 批量处理函数
- `withBatchAuthorIp()` - 批量为帖子数组添加IP
- `withBatchUserIp()` - 批量为评论数组添加IP

### 使用示例

```typescript
import { getRandomIpLocation, withAuthorIp, withUserIp } from '@/utils/mockData';

// 单个IP地址
const ip = getRandomIpLocation(); // '北京'

// 为帖子添加IP
const postWithIp = withAuthorIp(basePost, 0);

// 为评论添加IP
const commentWithIp = withUserIp(baseComment, 1);
```

---

## 已集成的模拟数据文件

### 帖子数据
- ✅ `src/mocks/post/data.ts` - 静态帖子模拟数据
- ✅ `src/pages/home/data.mock.ts` - 首页动态帖子生成
- ✅ `src/pages/UserProfile.store.ts` - 用户主页帖子生成
- ✅ `src/pages/TagVirtualPostList.tsx` - 标签页帖子生成
- ✅ `src/pages/RecentlyViewed.tsx` - 最近浏览帖子转换

### 评论数据
- ✅ `src/pages/home/data.mock.ts` - 动态评论生成
- ✅ `src/pages/CommentDemo.tsx` - 评论演示数据

### 用户数据
- ✅ `src/pages/UserProfile.store.ts` - 用户信息生成

---

## 显示位置总结

| 位置 | 使用函数 | 显示格式 | 示例 |
|-----|----------|----------|------|
| 👤 **用户个人主页** | `formatIpLocation()` | 完整格式 | `IP属地：北京` |
| 📄 **帖子详情页** | `getSimpleLocation()` | 简洁格式 | `北京` |
| 💬 **评论组件** | `getSimpleLocation()` | 简洁格式 | `上海` |

---

## 类型定义

### 接口扩展
所有相关数据类型已添加IP地址字段：

```typescript
// 帖子类型
interface BasePost {
  authorIpLocation?: string; // 作者IP地址
}

// 评论类型
interface Comment {
  userIpLocation?: string; // 用户IP地址
}

// 用户类型
interface UserProfileInfo {
  ipLocation: string; // 用户IP地址
}
```

---

## 注意事项

1. **一致性**: 使用索引参数确保相同用户/帖子的IP地址保持一致
2. **可选性**: 所有IP地址字段都是可选的，向后兼容现有代码
3. **真实性**: IP地址池包含真实的省份和国家名称
4. **扩展性**: 可以轻松添加新的IP地址到池中

---

## 开发规范

### 新增模拟数据时
1. 导入相关工具函数
2. 为帖子使用 `withAuthorIp()` 或直接设置 `authorIpLocation`
3. 为评论使用 `withUserIp()` 或直接设置 `userIpLocation`  
4. 为用户使用 `getRandomIpLocation()` 设置 `ipLocation`

### 显示IP地址时
1. 用户主页: 使用 `formatIpLocation()`
2. 帖子详情: 使用 `getSimpleLocation()`
3. 评论组件: 使用 `getSimpleLocation()`