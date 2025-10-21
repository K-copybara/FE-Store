import { Routes, Route } from 'react-router-dom';
import OrderManagementPage from './pages/OrderManagement/OrderManagementPage';
import CalendarPage from './pages/SalesReport/CalendarPage';
import DailyStatsPage from './pages/SalesReport/DailyStatsPage';
import StoreInfoPage from './pages/StoreInfo/StoreInfoPage';
import LoginPage from './pages/Auth/LoginPage';
import PrivateRoute from './pages/Auth/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<OrderManagementPage />} />
        <Route path="/SalesReport/Calendar" element={<CalendarPage />} />
        <Route path="/SalesReport/DailyStats" element={<DailyStatsPage />} />
        <Route path="/StoreInfo" element={<StoreInfoPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
export default App;
