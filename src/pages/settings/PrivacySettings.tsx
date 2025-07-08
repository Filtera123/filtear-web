import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  FormControlLabel, 
  TextField, 
  Button, 
  Box, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { IconTrash, IconPlus } from '@tabler/icons-react';

interface PrivacySettingsProps {
  type: string;
}

export default function PrivacySettings({ type }: PrivacySettingsProps) {
  const [blockedUsers, setBlockedUsers] = useState(['user123', 'user456']);
  const [blockedKeywords, setBlockedKeywords] = useState(['垃圾信息', '广告']);
  const [newBlockItem, setNewBlockItem] = useState('');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockType, setBlockType] = useState<'user' | 'keyword'>('user');



  const handleAddBlock = () => {
    if (newBlockItem.trim()) {
      if (blockType === 'user') {
        setBlockedUsers(prev => [...prev, newBlockItem.trim()]);
      } else {
        setBlockedKeywords(prev => [...prev, newBlockItem.trim()]);
      }
      setNewBlockItem('');
      setBlockDialogOpen(false);
    }
  };

  const handleRemoveBlock = (item: string, type: 'user' | 'keyword') => {
    if (type === 'user') {
      setBlockedUsers(prev => prev.filter(user => user !== item));
    } else {
      setBlockedKeywords(prev => prev.filter(keyword => keyword !== item));
    }
  };

  const openBlockDialog = (type: 'user' | 'keyword') => {
    setBlockType(type);
    setBlockDialogOpen(true);
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">屏蔽设置</h1>
          <p className="text-gray-600">管理您要屏蔽的用户和关键词</p>
        </div>

        {/* 屏蔽用户 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                屏蔽用户
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconPlus size={16} />}
                onClick={() => openBlockDialog('user')}
              >
                添加用户
              </Button>
            </div>
            
            {blockedUsers.length > 0 ? (
              <List>
                {blockedUsers.map((user, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={user}
                      secondary="已屏蔽此用户的所有内容"
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleRemoveBlock(user, 'user')}
                        size="small"
                      >
                        <IconTrash size={16} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" className="text-gray-500 text-center py-4">
                暂无屏蔽用户
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* 屏蔽关键词 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                屏蔽关键词
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconPlus size={16} />}
                onClick={() => openBlockDialog('keyword')}
              >
                添加关键词
              </Button>
            </div>
            
            {blockedKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {blockedKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    onDelete={() => handleRemoveBlock(keyword, 'keyword')}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </div>
            ) : (
              <Typography variant="body2" className="text-gray-500 text-center py-4">
                暂无屏蔽关键词
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* 添加屏蔽项对话框 */}
        <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            添加屏蔽{blockType === 'user' ? '用户' : '关键词'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label={blockType === 'user' ? '用户名' : '关键词'}
              value={newBlockItem}
              onChange={(e) => setNewBlockItem(e.target.value)}
              placeholder={blockType === 'user' ? '输入要屏蔽的用户名' : '输入要屏蔽的关键词'}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockDialogOpen(false)}>取消</Button>
            <Button onClick={handleAddBlock} variant="contained">添加</Button>
          </DialogActions>
        </Dialog>
      </div>
    );

} 