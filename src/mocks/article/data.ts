import type { ArticleItem } from '@components/editor/article-editor/use-article-editor';

export const mockArticle: ArticleItem = {
  id: '1',
  tempDraftId: 'temp-draft-1',
  title: 'Sample Article',
  summary: 'This is a sample article for testing purposes.',
  contentItems: [
    {
      text: 'This is the first paragraph of the article.',
      startIndex: 0,
      endIndex: 40,
      comment: [
        {
          id: 'comment1',
          content: 'This is a comment on the first paragraph.',
          useId: 'user1',
          isLike: false,
          likes: 5,
        },
      ],
    },
    {
      text: 'This is the second paragraph of the article.',
      startIndex: 41,
      endIndex: 82,
      comment: [
        {
          id: 'comment2',
          content: 'This is a comment on the second paragraph.',
          useId: 'user2',
          isLike: true,
          likes: 10,
        },
      ],
    },
  ],
  isLiked: false,
  isCollected: false,
  likes: 99,
  collectionCount: 9,
  viewCount: 1000,
  tags: [
    {
      id: 'tag1',
      name: 'Technology',
      description: 'Articles related to technology.',
      color: '#ff5733',
      icon: 'tech-icon',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    },
    {
      id: 'tag2',
      name: 'Science',
      description: 'Articles related to science.',
      color: '#33c1ff',
      icon: 'science-icon',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    },
  ],
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
  isRecycled: false,
  isDraft: false,
  isPinned: true,
  editorHistory: [
    {
      id: '1',
      tempDraftId: 'temp-draft-1',
      title: 'Draft Version 1',
      summary: 'This is the first draft version of the article.',
      contentItems: [
        {
          text: 'Draft content for the first version.',
          startIndex: 0,
          endIndex: 30,
          comment: [],
        },
      ],
      tags: [],
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      isRecycled: false,
      isDraft: true,
      isPinned: false,
    },
    {
      id: '1',
      tempDraftId: 'temp-draft-1',
      title: 'Draft Version 2',
      summary: 'This is the second draft version of the article.',
      contentItems: [
        {
          text: 'Draft content for the second version.',
          startIndex: 0,
          endIndex: 35,
          comment: [],
        },
      ],
      tags: [],
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      isRecycled: false,
      isDraft: true,
      isPinned: false,
    },
  ],
  isPublic: true,
  collectionId: 'collection1',
};
export const mockArticle2: ArticleItem = {
  id: '2',
  tempDraftId: 'temp-draft-2',
  title: 'Another Sample Article ArticleArticleArticle',
  summary: 'This is another sample article for testing purposes.',
  contentItems: [
    {
      text: 'This is the first paragraph of another article.',
      startIndex: 0,
      endIndex: 45,
      comment: [],
    },
    {
      text: 'This is the second paragraph of another article.',
      startIndex: 46,
      endIndex: 91,
      comment: [],
    },
  ],
  tags: [],
  isLiked: false,
  isCollected: false,
  likes: 99,
  collectionCount: 9,
  viewCount: 1000,
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
  isRecycled: false,
  isDraft: false,
  isPinned: false,
  editorHistory: [],
  isPublic: true,
  collectionId: 'collection2',
};

export const mockArticleList: ArticleItem[] = [mockArticle, mockArticle2];

export const mockDraftList: ArticleItem[] = [mockArticle, mockArticle2];
