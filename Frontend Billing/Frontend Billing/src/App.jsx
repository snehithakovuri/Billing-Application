import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

{/* Public imports */}
import AboutUs from "./components/AboutUs";
import Login from "./components/Login-Register/Login";
import Register from "./components/Login-Register/Register";
import ForgotPassword from "./components/Recover-Password/ForgotPassword";
import ResetPassword from "./components/Recover-Password/ResetPassword";
import SessionTimeout from "./components/SessionTimeout";
import NotFound from "./components/NotFound";
import HomePage from "./components/HomePage";

{/* Admin imports */}
import AdminHome from "./components/Admin/AdminHome";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminWelcome from "./components/Admin/AdminWelcome";
import UserManagement from "./components/Admin/UserManagement";
import EditUser from "./components/Admin/EditUser";
import AddUser from "./components/Admin/AddUser";
import ProductService from "./components/Admin/ProductService";
import EditProductService from "./components/Admin/EditProductService";
import AddProductService from "./components/Admin/AddProductService";

{/* Common imports for Admin and Accountant */}
import CustomerManagement from "./components/Admin/CustomerManagement";
import EditCustomer from "./components/Admin/EditCustomer";
import AddCustomer from "./components/Admin/AddCustomer";
import InvoiceManagement from "./components/Admin/InvoiceManagement";
import AddInvoice from "./components/Admin/AddInvoice";
import EditInvoice from "./components/Admin/EditInvoice";
import PaymentsTracking from "./components/Admin/PaymentsTracking";
import RecordPayment from "./components/Admin/RecordPayment";
import ReportingAnalytics from "./components/Admin/ReportingAnalytics";

{/* Accountant imports */}
import AccountantHome from "./components/Accountant/AccountantHome";
import AccountantLayout from "./components/Accountant/AccountantLayout";
import AccountantWelcome from "./components/Accountant/AccountantWelcome";
import AccountantProfile from "./components/Accountant/AccountantProfile";

{/* Customer imports */}
import CustomerHome from "./components/Customer/CustomerHome";
import CustomerLayout from "./components/Customer/CustomerLayout";
import CustomerWelcome from "./components/Customer/CustomerWelcome";
import CustomerProfile from "./components/Customer/CustomerProfile";
import CustomerInvoices from "./components/Customer/CustomerInvoices";
import Invoice from "./components/Customer/Invoice";
import MakePayment from "./components/Customer/MakePayment";
import PaymentsHistory from "./components/Customer/PaymentsHistory";
import InvoicePayments from "./components/Customer/InvoicePayments";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/session-timeout" element={<SessionTimeout />} />
      <Route path="*" element={<NotFound />} />

      {/* Admin + Accountant Shared Routes */}
      <Route
        path="addcustomer"
        element={
          <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
            <AddCustomer />
          </ProtectedRoute>
        }
      />
      <Route
        path="editcustomer/:id"
        element={
          <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
            <EditCustomer />
          </ProtectedRoute>
        }
      />
      <Route
        path="add-invoice"
        element={
          <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
            <AddInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-invoice/:invoiceNumber"
        element={
          <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
            <EditInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/record-payment"
        element={
          <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
            <RecordPayment />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admindashboard" element={<AdminWelcome />} />
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/customermanagement" element={<CustomerManagement />} />
        <Route path="/productservice" element={<ProductService />} />
        <Route path="/invoicemanagement" element={<InvoiceManagement />} />
        <Route path="/paymentstracking" element={<PaymentsTracking />} />
        <Route path="/reportinganalytics" element={<ReportingAnalytics />} />
      </Route>

      <Route
        path="/admin-home"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-user"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AddUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-user/:email"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <EditUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-productservice/:name"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <EditProductService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-productservice"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AddProductService />
          </ProtectedRoute>
        }
      />

      {/* Accountant Routes */}
      <Route
        element={
          <ProtectedRoute roles={["ACCOUNTANT"]}>
            <AccountantLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/accountantdashboard" element={<AccountantWelcome />} />
        <Route path="/customer-management" element={<CustomerManagement />} />
        <Route path="/invoice-management" element={<InvoiceManagement />} />
        <Route path="/payments-tracking" element={<PaymentsTracking />} />
        <Route path="/reporting-analytics" element={<ReportingAnalytics />} />
        <Route path="/my-profile" element={<AccountantProfile />} />
      </Route>

      <Route
        path="/accountant-home"
        element={
          <ProtectedRoute roles={["ACCOUNTANT"]}>
            <AccountantHome />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        element={
          <ProtectedRoute roles={["CUSTOMER"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/customerdashboard" element={<CustomerWelcome />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/customerinvoices" element={<CustomerInvoices />} />
        <Route path="/makepayment" element={<MakePayment />} />
        <Route path="/paymentshistory" element={<PaymentsHistory />} />
      </Route>

      <Route
        path="/customer-home"
        element={
          <ProtectedRoute roles={["CUSTOMER"]}>
            <CustomerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice/:invoiceNumber"
        element={
          <ProtectedRoute roles={["CUSTOMER"]}>
            <Invoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice-payments/:invoiceNumber"
        element={
          <ProtectedRoute roles={["CUSTOMER"]}>
            <InvoicePayments />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
