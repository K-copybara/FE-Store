import { useContext } from 'react';
import { StoreInfoContext } from '../api/StoreInfoContext';

export const useStores = () => {
  const context = useContext(StoreInfoContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreInfoProvider');
  }
  return context;
};