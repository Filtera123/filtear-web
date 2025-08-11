/**
 * IP地址位置格式化工具函数
 * 国内显示精确到省份，国外精确到国家
 */

// 中国省份/直辖市/自治区列表
const CHINA_PROVINCES = [
  '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆',
  '香港', '澳门'
];

// 常见国家列表
const FOREIGN_COUNTRIES = [
  '美国', '加拿大', '英国', '法国', '德国', '意大利', '西班牙', '荷兰',
  '日本', '韩国', '新加坡', '泰国', '马来西亚', '印度尼西亚', '菲律宾',
  '澳大利亚', '新西兰', '俄罗斯', '印度', '巴西', '阿根廷', '墨西哥'
];

/**
 * 格式化IP地址位置信息
 * @param ipLocation - 原始IP地址位置信息
 * @returns 格式化后的位置信息
 */
export const formatIpLocation = (ipLocation?: string): string => {
  if (!ipLocation) {
    return 'IP属地未知';
  }

  const location = ipLocation.trim();
  
  // 检查是否为空
  if (!location) {
    return 'IP属地未知';
  }

  // 如果是中国省份，显示省份
  for (const province of CHINA_PROVINCES) {
    if (location.includes(province)) {
      return `IP属地：${province}`;
    }
  }

  // 如果是国外国家，显示国家
  for (const country of FOREIGN_COUNTRIES) {
    if (location.includes(country)) {
      return `IP属地：${country}`;
    }
  }

  // 如果包含"中国"但没有匹配到具体省份，尝试提取省份信息
  if (location.includes('中国')) {
    // 尝试匹配 "中国·省份" 或 "中国 省份" 格式
    const chinaMatch = location.match(/中国[·\s]?(.+)/);
    if (chinaMatch && chinaMatch[1]) {
      const provinceInfo = chinaMatch[1].trim();
      // 检查提取的部分是否为已知省份
      for (const province of CHINA_PROVINCES) {
        if (provinceInfo.includes(province)) {
          return `IP属地：${province}`;
        }
      }
      // 如果不是已知省份，返回提取的信息
      return `IP属地：${provinceInfo}`;
    }
    return 'IP属地：中国';
  }

  // 其他情况，直接显示原始信息
  return `IP属地：${location}`;
};

/**
 * 检查是否为国内IP
 * @param ipLocation - IP地址位置信息
 * @returns 是否为国内IP
 */
export const isChineseIp = (ipLocation?: string): boolean => {
  if (!ipLocation) {
    return false;
  }

  const location = ipLocation.trim();
  
  // 检查是否包含中国省份
  for (const province of CHINA_PROVINCES) {
    if (location.includes(province)) {
      return true;
    }
  }

  // 检查是否包含"中国"
  return location.includes('中国');
};

/**
 * 获取简化的位置信息（仅位置名称，不含"IP属地："前缀）
 * @param ipLocation - 原始IP地址位置信息
 * @returns 简化的位置信息
 */
export const getSimpleLocation = (ipLocation?: string): string => {
  const formatted = formatIpLocation(ipLocation);
  return formatted.replace('IP属地：', '');
};