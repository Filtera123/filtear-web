import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

// 产品模块选项
const productModules = [
  { value: 'homepage', label: '首页功能' },
  { value: 'editor', label: '编辑器' },
  { value: 'comment', label: '评论系统' },
  { value: 'profile', label: '个人主页' },
  { value: 'search', label: '搜索功能' },
  { value: 'notification', label: '通知中心' },
  { value: 'other', label: '其他' },
];

export default function FeedbackForm() {
  const [selectedModule, setSelectedModule] = useState('');
  const [feedback, setFeedback] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleModuleChange = (event: SelectChangeEvent) => {
    setSelectedModule(event.target.value);
  };

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (text.length <= maxChars) {
      setFeedback(text);
      setCharCount(text.length);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = () => {
    console.log('提交反馈:', {
      module: selectedModule,
      feedback,
      hasImage: !!imagePreview
    });
    // 在这里添加实际的提交逻辑
    alert('感谢您的反馈！');
    setSelectedModule('');
    setFeedback('');
    setImagePreview(null);
    setCharCount(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">意见反馈</h1>
        <p className="text-gray-600">感谢您提供宝贵的产品建议</p>
      </div>

      {/* 意见反馈表单 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* 问题区域选择 */}
            <div>
              <Typography variant="body1" gutterBottom>
                您在哪个页面遇到了问题？
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedModule}
                  onChange={handleModuleChange}
                  displayEmpty
                  renderValue={(value) => value || "请选择产品模块"}
                >
                  {productModules.map((module) => (
                    <MenuItem key={module.value} value={module.value}>
                      {module.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* 问题描述 */}
            <div>
              <Typography variant="body1" gutterBottom>
                描述您的问题（{charCount}/{maxChars}字以内）
              </Typography>
              <TextField
                multiline
                rows={6}
                fullWidth
                placeholder="请详细描述您遇到的问题或建议..."
                value={feedback}
                onChange={handleFeedbackChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <Typography 
                      variant="caption" 
                      color="textSecondary" 
                      style={{ position: 'absolute', bottom: 8, right: 8 }}
                    >
                      {charCount}/{maxChars}
                    </Typography>
                  )
                }}
              />
            </div>

            {/* 图片上传 */}
            <div>
              <Typography variant="body1" gutterBottom>
                上传图片附件
              </Typography>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 relative">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="预览图" 
                      className="h-48 object-contain mx-auto"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 relative">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <Typography variant="body2" color="textSecondary" className="mb-2">
                      点击上传图片
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      支持 JPG、PNG 格式
                    </Typography>
                    <label className="absolute inset-0 w-full h-full cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png" 
                        className="sr-only"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-3">
              <Button variant="outlined">
                取消
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!selectedModule || !feedback}
              >
                提交
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 