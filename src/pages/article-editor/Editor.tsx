import React, { useEffect } from 'react';
import { useArticleEditorStore, useDraftStore } from '@components/editor';
import { Stack, styled, TextField } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { mockArticleList } from '@/mocks';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.primary,
  },
}));

const Editor = () => {
  const { article, updateArticle, setArticle } = useArticleEditorStore();
  const [searchParams] = useSearchParams();
  const { drafts, updateDraft } = useDraftStore();

  useEffect(() => {
    const id = searchParams.get('id');

    if (id) {
      const articleData = mockArticleList.find((item) => item.id === id || item.tempDraftId === id);
      const draftData = drafts.find((item) => item.id === id || item.tempDraftId === id);
      if (draftData || articleData) {
        setArticle(draftData || articleData);
      }
    }
  }, [searchParams]);

  return (
    <Stack spacing={2}>
      <StyledTextField
        required
        className="w-full bg-white rounded-md"
        label="文章标题"
        variant="outlined"
        placeholder="请输入文章标题"
        value={article.title}
        onChange={(e) => {
          const value = {
            title: e.target.value,
          };
          updateArticle(value);
          updateDraft({ ...value, id: article.id, tempDraftId: article.tempDraftId });
        }}
      />
      <StyledTextField
        className="w-full bg-white  rounded-md"
        label="引言"
        variant="outlined"
        placeholder="请输入引言"
        value={article.summary}
        onChange={(e) => {
          const value = {
            summary: e.target.value,
          };
          updateArticle(value);
          updateDraft({
            ...value,
            id: article.id,
            tempDraftId: article.tempDraftId,
          });
        }}
      />
      <div className="bg-white h-[calc(100vh-13.5rem)] rounded-md">正文区域</div>
    </Stack>
  );
};

export default Editor;
