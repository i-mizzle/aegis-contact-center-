import Recipients from './pages/admin/payments-assistance/Recipients';
import PublicWarnings from './pages/admin/public-warnings/PublicWarnings';
import Budgets from './pages/admin/payments-assistance/Budgets';
import BudgetDetails from './pages/admin/payments-assistance/BudgetDetails';
import Programmes from './pages/admin/payments-assistance/Programmes';
import Resources from './pages/admin/resources/Resources';
import Resource from './pages/admin/resources/resource/Resource';
import ResourcePersonnel from './pages/admin/resources/resource/ResourcePersonnel';
import ResourceAssets from './pages/admin/resources/resource/ResourceAssets';
import Incidents from './pages/admin/incidents/Incidents';
import CommandDashboard from './pages/admin/dashboard/dashboards/CommandDashboard';
import CallCenterDashboard from './pages/admin/dashboard/dashboards/CallCenterDashboard';
import DispatchOperationsDashboard from './pages/admin/dashboard/dashboards/DispatchOperationsDashboard';
import AnalyticsIntelligence from './pages/admin/dashboard/dashboards/AnalyticsIntelligence';
import ResponderDashboard from './pages/admin/dashboard/dashboards/ResponderDashboard';
import PerformanceDashboard from './pages/admin/dashboard/dashboards/PerformanceDashboard';
import PublicWarningDashboard from './pages/admin/dashboard/dashboards/PublicWarningDashboard';
import PaymentsAssistance from './pages/admin/dashboard/dashboards/PaymentsAssistance';
import { Provider } from 'react-redux';

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Admin from './pages/admin/Admin';
import Dashboard from './pages/admin/dashboard/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import ErrorNotifier from './components/elements/ErrorNotifier';
import SuccessNotifier from './components/elements/SuccessNotifier';
import ScrollToTop from './components/layouts/ScrollToTop';
import store from './store/store';
import AdminErrorPage from './pages/admin/AdminErrorPage';
import IncidentDetails from './pages/admin/incidents/IncidentDetails';
import PaymentsAssistancePage from './pages/admin/payments-assistance/PaymentsAssistancePage';
import Payments from './pages/admin/payments-assistance/Payments';

function App() {

  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorNotifier />
        <SuccessNotifier />
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Login />} />
            
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Navigate replace to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<Dashboard />}>
                <Route index element={<Navigate replace to="/admin/dashboard/command" />} />
                <Route path="/admin/dashboard/command" element={<CommandDashboard />} />
                <Route path="/admin/dashboard/call-center" element={<CallCenterDashboard />} />
                <Route path="/admin/dashboard/dispatch-operations" element={<DispatchOperationsDashboard />} />
                <Route path="/admin/dashboard/analytics-intelligence" element={<AnalyticsIntelligence />} />
                <Route path="/admin/dashboard/responder" element={<ResponderDashboard />} />
                <Route path="/admin/dashboard/performance-reporting" element={<PerformanceDashboard />} />
                <Route path="/admin/dashboard/public-warning-notifications" element={<PublicWarningDashboard />} />
                <Route path="/admin/dashboard/payments-assistance" element={<PaymentsAssistance />} />
              </Route>

              <Route path="/admin/incidents" element={<Incidents />} />
              <Route path="/admin/incidents/:incidentId" element={<IncidentDetails />} />
              <Route path="/admin/public-warnings" element={<PublicWarnings />} />

              <Route path="/admin/payments-assistance" element={<PaymentsAssistancePage />}>
                <Route index element={<Navigate replace to="/admin/payments-assistance/budgets" />} />
                <Route path="/admin/payments-assistance/budgets" element={<Budgets />} />
                <Route path="/admin/payments-assistance/budgets/:budgetId" element={<BudgetDetails />} />
                <Route path="/admin/payments-assistance/programmes" element={<Programmes />} />
                <Route path="/admin/payments-assistance/recipients" element={<Recipients />} />
                <Route path="/admin/payments-assistance/payments" element={<Payments />} />
              </Route>

              <Route path="/admin/resources-assets" element={<Resources />}>
                <Route index element={<Navigate replace to="/admin/resources-assets/resources" />} />
                <Route path="/admin/resources-assets/resources" element={<Resources />} />
                <Route path="/admin/resources-assets/resources/:resourceId" element={<Resource />} />
                <Route path="/admin/resources-assets/resources/:resourceId/personnel" element={<ResourcePersonnel />} />
                <Route path="/admin/resources-assets/resources/:resourceId/assets" element={<ResourceAssets />} />
              </Route>
              
              {/* <Route path="/admin/settings" element={<Settings />}>
                <Route index element={<Navigate replace to="/admin/settings/profile" />} />
                <Route path="/admin/settings/profile" element={<Profile />} />
                <Route path="/admin/settings/users" element={<AdminUsers />} />
                <Route path="/admin/settings/users/:userId" element={<AdminUser />} />
              </Route> */}

              <Route path="*" element={<AdminErrorPage />} />
            </Route>

          </Routes>
        </ScrollToTop>
      </ThemeProvider>
    </Provider>
  )
}

export default App
