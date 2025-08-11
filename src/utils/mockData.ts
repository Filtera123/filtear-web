/**
 * 模拟数据生成工具
 * 提供IP地址、用户信息等基础模拟数据生成功能
 */

// IP地址池 - 包含国内省份和国外国家
export const IP_LOCATIONS = [
  // 国内省份/直辖市/自治区
  '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆',
  '香港', '澳门',
  // 国外国家
  '美国', '加拿大', '英国', '法国', '德国', '意大利', 
  '西班牙', '荷兰', '日本', '韩国', '新加坡', '泰国',
  '马来西亚', '印度尼西亚', '菲律宾', '澳大利亚', 
  '新西兰', '俄罗斯', '印度', '巴西'
];

/**
 * 随机获取一个IP地址
 * @param index 可选索引，用于保证相同索引返回相同IP
 * @returns IP地址字符串
 */
export const getRandomIpLocation = (index?: number): string => {
  const randomIndex = index !== undefined 
    ? index % IP_LOCATIONS.length 
    : Math.floor(Math.random() * IP_LOCATIONS.length);
  return IP_LOCATIONS[randomIndex];
};

/**
 * 为对象添加IP地址字段
 * @param obj 要添加IP地址的对象
 * @param index 可选索引，用于保证相同索引返回相同IP
 * @param fieldName IP地址字段名，默认为 'ipLocation'
 * @returns 包含IP地址的新对象
 */
export const withIpLocation = <T extends Record<string, any>>(
  obj: T, 
  index?: number, 
  fieldName: string = 'ipLocation'
): T & Record<string, string> => {
  return {
    ...obj,
    [fieldName]: getRandomIpLocation(index)
  };
};

/**
 * 为帖子添加作者IP地址
 * @param post 帖子对象
 * @param index 可选索引
 * @returns 包含作者IP地址的帖子对象
 */
export const withAuthorIp = <T extends Record<string, any>>(
  post: T, 
  index?: number
): T & { authorIpLocation: string } => {
  return withIpLocation(post, index, 'authorIpLocation') as T & { authorIpLocation: string };
};

/**
 * 为评论添加用户IP地址
 * @param comment 评论对象
 * @param index 可选索引
 * @returns 包含用户IP地址的评论对象
 */
export const withUserIp = <T extends Record<string, any>>(
  comment: T, 
  index?: number
): T & { userIpLocation: string } => {
  return withIpLocation(comment, index, 'userIpLocation') as T & { userIpLocation: string };
};

/**
 * 批量为数组中的对象添加IP地址
 * @param items 对象数组
 * @param fieldName IP地址字段名
 * @returns 包含IP地址的新数组
 */
export const withBatchIpLocation = <T extends Record<string, any>>(
  items: T[], 
  fieldName: string = 'ipLocation'
): (T & Record<string, string>)[] => {
  return items.map((item, index) => withIpLocation(item, index, fieldName));
};

/**
 * 批量为帖子数组添加作者IP地址
 * @param posts 帖子数组
 * @returns 包含作者IP地址的帖子数组
 */
export const withBatchAuthorIp = <T extends Record<string, any>>(
  posts: T[]
): (T & { authorIpLocation: string })[] => {
  return posts.map((post, index) => withAuthorIp(post, index));
};

/**
 * 批量为评论数组添加用户IP地址
 * @param comments 评论数组
 * @returns 包含用户IP地址的评论数组
 */
export const withBatchUserIp = <T extends Record<string, any>>(
  comments: T[]
): (T & { userIpLocation: string })[] => {
  return comments.map((comment, index) => withUserIp(comment, index));
};