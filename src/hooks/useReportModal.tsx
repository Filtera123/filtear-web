import { useState } from 'react';

interface ReportModalState {
  isOpen: boolean;
  contentId: string;
  contentType: 'post' | 'comment' | 'user';
  authorId?: string;
}

const initialState: ReportModalState = {
  isOpen: false,
  contentId: '',
  contentType: 'post',
  authorId: '',
};

export const useReportModal = () => {
  const [reportModalState, setReportModalState] = useState<ReportModalState>(initialState);

  const openReportModal = (contentId: string, contentType: 'post' | 'comment' | 'user', authorId?: string) => {
    setReportModalState({
      isOpen: true,
      contentId,
      contentType,
      authorId,
    });
  };

  const closeReportModal = () => {
    setReportModalState(initialState);
  };

  return {
    reportModalState,
    openReportModal,
    closeReportModal,
  };
}; 