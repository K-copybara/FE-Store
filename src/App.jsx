import { Routes, Route } from 'react-router-dom';
import OrderManagementPage from './pages/OrderManagement/OrderManagementPage';
import CalendarPage from './pages/SalesReport/CalendarPage';
import DailyStatsPage from './pages/SalesReport/DailyStatsPage';
import StoreInfoPage from './pages/StoreInfo/StoreInfoPage';
import { SalesProvider } from './api/SalesProvider';
import { StoreInfoProvider } from './api/StoreInfoProvider';
import { SSEOrderProvider } from './components/SSE/SSEorderProvider';
import { SSERequestProvider } from './components/SSE/SSErequestProvider';

function App() {
  return (
    <SSEOrderProvider>
      <SSERequestProvider>
        <StoreInfoProvider>
          <SalesProvider>
            <Routes>
              <Route path="/" element={<OrderManagementPage />} />
              <Route path="/SalesReport/Calendar" element={<CalendarPage />} />
              <Route
                path="/SalesReport/DailyStats"
                element={<DailyStatsPage />}
              />
              <Route path="/StoreInfo" element={<StoreInfoPage />} />
            </Routes>
          </SalesProvider>
        </StoreInfoProvider>
      </SSERequestProvider>
    </SSEOrderProvider>
  );
}
export default App;
