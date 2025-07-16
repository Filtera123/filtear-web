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
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { IconTrash, IconPlus } from '@tabler/icons-react';

interface PrivacySettingsProps {
  type: string;
}

export default function PrivacySettings({ type }: PrivacySettingsProps) {
  const [blockedUsers, setBlockedUsers] = useState(['user123', 'user456']);
  const [blockedKeywords, setBlockedKeywords] = useState(['垃圾信息', '广告']);
  const [blockedPosts, setBlockedPosts] = useState(['哈哈哈哈哈哈', '123456789...']);
  const [blockedTags, setBlockedTags] = useState(['标签1', '标签2']);
  const [commentFilters, setCommentFilters] = useState(['过滤规则1', '过滤规则2']);
  const [newBlockItem, setNewBlockItem] = useState('');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockType, setBlockType] = useState<'user' | 'keyword' | 'post' | 'tag' | 'comment'>('user');
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddBlock = () => {
    if (newBlockItem.trim()) {
      if (blockType === 'user') {
        setBlockedUsers(prev => [...prev, newBlockItem.trim()]);
      } else if (blockType === 'keyword') {
        setBlockedKeywords(prev => [...prev, newBlockItem.trim()]);
      } else if (blockType === 'post') {
        setBlockedPosts(prev => [...prev, newBlockItem.trim()]);
      } else if (blockType === 'tag') {
        setBlockedTags(prev => [...prev, newBlockItem.trim()]);
      } else if (blockType === 'comment') {
        setCommentFilters(prev => [...prev, newBlockItem.trim()]);
      }
      setNewBlockItem('');
      setBlockDialogOpen(false);
    }
  };

  const handleRemoveBlock = (item: string, type: 'user' | 'keyword' | 'post' | 'tag' | 'comment') => {
    if (type === 'user') {
      setBlockedUsers(prev => prev.filter(user => user !== item));
    } else if (type === 'keyword') {
      setBlockedKeywords(prev => prev.filter(keyword => keyword !== item));
    } else if (type === 'post') {
      setBlockedPosts(prev => prev.filter(post => post !== item));
    } else if (type === 'tag') {
      setBlockedTags(prev => prev.filter(tag => tag !== item));
    } else if (type === 'comment') {
      setCommentFilters(prev => prev.filter(filter => filter !== item));
    }
  };

  const openBlockDialog = (type: 'user' | 'keyword' | 'post' | 'tag' | 'comment') => {
    setBlockType(type);
    setBlockDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 标签页导航 */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            aria-label="block settings tabs"
          >
            <Tab label="屏蔽tag" id="block-tab-0" aria-controls="block-tabpanel-0" />
            <Tab label="评论过滤器" id="block-tab-1" aria-controls="block-tabpanel-1" />
            <Tab label="屏蔽用户" id="block-tab-2" aria-controls="block-tabpanel-2" />
            <Tab label="屏蔽关键词" id="block-tab-3" aria-controls="block-tabpanel-3" />
            <Tab label="屏蔽博文" id="block-tab-4" aria-controls="block-tabpanel-4" />
          </Tabs>
        </Box>

        {/* 屏蔽tag面板 */}
        <TabPanel value={activeTab} index={0}>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold">
              屏蔽tag
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<IconPlus size={16} />}
              onClick={() => openBlockDialog('tag')}
            >
              添加tag
            </Button>
          </div>
          
          {blockedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {blockedTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveBlock(tag, 'tag')}
                  variant="outlined"
                  size="small"
                />
              ))}
            </div>
          ) : (
            <Typography variant="body2" className="text-gray-500 text-center py-4">
              暂无屏蔽tag
            </Typography>
          )}
        </TabPanel>

        {/* 评论过滤器面板 */}
        <TabPanel value={activeTab} index={1}>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold">
              评论过滤器
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<IconPlus size={16} />}
              onClick={() => openBlockDialog('comment')}
            >
              添加过滤规则
            </Button>
          </div>
          
          {commentFilters.length > 0 ? (
            <List>
              {commentFilters.map((filter, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={filter}
                    secondary="已设置此评论过滤规则"
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveBlock(filter, 'comment')}
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
              暂无评论过滤规则
            </Typography>
          )}
        </TabPanel>

        {/* 屏蔽用户面板 */}
        <TabPanel value={activeTab} index={2}>
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
        </TabPanel>

        {/* 屏蔽关键词面板 */}
        <TabPanel value={activeTab} index={3}>
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
        </TabPanel>

        {/* 屏蔽博文面板 */}
        <TabPanel value={activeTab} index={4}>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold">
              屏蔽博文
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<IconPlus size={16} />}
              onClick={() => openBlockDialog('post')}
            >
              添加博文
            </Button>
          </div>
          
          {blockedPosts.length > 0 ? (
            <List>
              {blockedPosts.map((post, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={post}
                    secondary="已屏蔽此博文"
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveBlock(post, 'post')}
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
              暂无屏蔽博文
            </Typography>
          )}
        </TabPanel>
      </Card>

      {/* 添加屏蔽项对话框 */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {blockType === 'user' && '添加屏蔽用户'}
          {blockType === 'keyword' && '添加屏蔽关键词'}
          {blockType === 'post' && '添加屏蔽博文'}
          {blockType === 'tag' && '添加屏蔽tag'}
          {blockType === 'comment' && '添加评论过滤规则'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={
              blockType === 'user' ? '用户名' : 
              blockType === 'keyword' ? '关键词' : 
              blockType === 'post' ? '博文' :
              blockType === 'tag' ? 'tag' : '过滤规则'
            }
            value={newBlockItem}
            onChange={(e) => setNewBlockItem(e.target.value)}
            placeholder={
              blockType === 'user' ? '输入要屏蔽的用户名' : 
              blockType === 'keyword' ? '输入要屏蔽的关键词' : 
              blockType === 'post' ? '输入要屏蔽的博文' :
              blockType === 'tag' ? '输入要屏蔽的tag' : '输入评论过滤规则'
            }
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

// TabPanel component to handle tab content visibility
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`block-tabpanel-${index}`}
      aria-labelledby={`block-tab-${index}`}
      className="p-6"
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
} 