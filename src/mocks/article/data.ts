import type { ArticleItem } from '@components/editor/article-editor/use-article-editor';

export const mockArticle: ArticleItem = {
  id: '1',
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
  tags: [
    {
      id: 'tag1',
      name: 'Technology',
      description: 'Articles related to technology.',
      color: '#ff5733',
      icon: 'tech-icon',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tag2',
      name: 'Science',
      description: 'Articles related to science.',
      color: '#33c1ff',
      icon: 'science-icon',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isRecycled: false,
  isDraft: false,
  isPinned: true,
  editorHistory: [
    {
      id: 'history1',
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
      createdAt: new Date(),
      updatedAt: new Date(),
      isRecycled: false,
      isDraft: true,
      isPinned: false,
    },
    {
      id: 'history2',
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
      createdAt: new Date(),
      updatedAt: new Date(),
      isRecycled: false,
      isDraft: true,
      isPinned: false,
    },
  ],
  isPublic: true,
  collectionId: 'collection1',
};
