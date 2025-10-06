import { useContext } from 'react';
import { RequestContext } from '../api/RequestContext';

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within RequestProvider');
  }
  return context;
};