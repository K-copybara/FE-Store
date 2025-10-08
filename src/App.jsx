import {Routes, Route } from 'react-router-dom';
import OrderManagementPage from './pages/OrderManagement/OrderManagementPage';
import CalendarPage from './pages/SalesReport/CalendarPage';
import DailyStatsPage from './pages/SalesReport/DailyStatsPage';
import StoreInfoPage from './pages/StoreInfo/StoreInfoPage';
import {OrderProvider} from './api/OrderProvider';
import {RequestProvider} from './api/RequestProvider';

function App() {
  return (

  <OrderProvider>
    <RequestProvider>
       <Routes>
            <Route path="/" element={<OrderManagementPage />} />
            <Route path="/SalesReport/Calendar" element={<CalendarPage />} />
            <Route path="/SalesReport/DailyStats" element={<DailyStatsPage />} />
            <Route path="/StoreInfo" element={<StoreInfoPage />} />
            </Routes>
    </RequestProvider>
  </OrderProvider>

);
}
export default App
