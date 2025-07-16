import React, { createContext, useContext } from 'react';
import { useReportModal } from '../../hooks/useReportModal';
import ReportModal from './ReportModal';

// Define the context type
type ReportContextType = ReturnType<typeof useReportModal>;

// Create the context with a default value
const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Provider component
export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reportModal = useReportModal();
  
  return (
    <ReportContext.Provider value={reportModal}>
      {children}
      <ReportModal
        isOpen={reportModal.reportModalState.isOpen}
        onClose={reportModal.closeReportModal}
        contentId={reportModal.reportModalState.contentId}
        contentType={reportModal.reportModalState.contentType}
        authorId={reportModal.reportModalState.authorId}
      />
    </ReportContext.Provider>
  );
};

// Custom hook to use the context
export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
}; 