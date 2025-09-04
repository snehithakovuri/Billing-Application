
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./ReportingAnalytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const monthsList = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const COLORS = [
  "#007bff", "#f0ad4e", "#5cb85c",
  "#d9534f", "#5bc0de", "#292b2c",
];

export default function ReportingAnalytics() {
  const currentDate = new Date();
  const [month, setMonth] = useState(monthsList[currentDate.getMonth()]);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [viewMode, setViewMode] = useState("MONTH");

  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    invoices: 0,
    payments: 0,
    overdue: 0,
    successRate: 0,
    revenueTrend: [],
    paymentMethods: [],
    topCustomers: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [month, year, viewMode]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [invoicesRes, paymentsRes] = await Promise.all([
        api.get("/invoices", { headers }),
        api.get("/payments", { headers }),
      ]);

      const allInvoices = invoicesRes.data;
      const allPayments = paymentsRes.data;

      const monthIndex = monthsList.indexOf(month);

      const filteredInvoices = allInvoices.filter((inv) => {
        const invDate = new Date(inv.dueDate);
        return (
          invDate.getFullYear() === parseInt(year) &&
          (viewMode === "YEAR" || invDate.getMonth() === monthIndex)
        );
      });

      const filteredPayments = allPayments.filter((pmt) => {
        const pmtDate = new Date(pmt.paymentDate);
        return (
          pmtDate.getFullYear() === parseInt(year) &&
          (viewMode === "YEAR" || pmtDate.getMonth() === monthIndex)
        );
      });

      const totalRevenue = filteredPayments.reduce((acc, pmt) => acc + pmt.amount, 0);

      const overdueCount = filteredInvoices.filter(
        (inv) => new Date(inv.dueDate) < new Date() && inv.status !== "PAID"
      ).length;

      const totalInvoiceAmount = filteredInvoices.reduce(
        (sum, inv) => sum + (inv.totalAmount || 0),
        0
      );
      const totalPaidAmount = filteredPayments.reduce(
        (sum, pmt) => sum + pmt.amount,
        0
      );
      const successRate = ((totalPaidAmount / totalInvoiceAmount) * 100 || 0).toFixed(1);

      const revenueTrend = monthsList.map((m, index) => {
        const total = allPayments.reduce((sum, p) => {
          const d = new Date(p.paymentDate);
          return d.getMonth() === index && d.getFullYear() === parseInt(year)
            ? sum + p.amount
            : sum;
        }, 0);
        return { name: m, revenue: total };
      });

const methodCount = {
  CASH: 0,
  CARD: 0,
  UPI: 0,
  QR: 0,
  BANK_TRANSFER: 0,
};

filteredPayments.forEach((p) => {
  if (p.method === "CREDIT_CARD" || p.method === "DEBIT_CARD") {
    methodCount.CARD++;
  } else if (methodCount[p.method] !== undefined) {
    methodCount[p.method]++;
  }
});

const paymentMethods = Object.entries(methodCount).map(([name, value]) => ({
  name,
  value,
}));

      const topMap = {};
      const invoiceMap = {};

      filteredInvoices.forEach((inv) => {
        const name = inv.customer?.fullName || "Unknown";
        invoiceMap[name] = (invoiceMap[name] || 0) + 1;
      });

      filteredPayments.forEach((pmt) => {
        const name = pmt.invoice?.customer?.fullName || "Unknown";
        if (!topMap[name]) {
          topMap[name] = { paid: 0, invoices: invoiceMap[name] || 0 };
        }
        topMap[name].paid += pmt.amount;
      });

      const topCustomers = Object.entries(topMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.paid - a.paid)
        .slice(0, 4);

      setAnalytics({
        totalRevenue,
        invoices: filteredInvoices.length,
        payments: filteredPayments.length,
        overdue: overdueCount,
        successRate,
        revenueTrend,
        paymentMethods,
        topCustomers,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  return (
    <div className="analytics-container">
      <h2>Reporting & Analytics</h2>

      <div className="filters">
        <select className="btn1" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="MONTH">Monthly</option>
          <option value="YEAR">Yearly</option>
        </select>

        {viewMode === "MONTH" && (
          <select className="btn2" value={month} onChange={(e) => setMonth(e.target.value)}>
            {monthsList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        <select className="btn3" value={year} onChange={(e) => setYear(e.target.value)}>
          {[2025, 2024, 2023].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          Total Revenue <br />
          <strong>₹ {analytics.totalRevenue.toLocaleString()}</strong>
        </div>
        <div className="metric-card">
          Invoices <br />
          <strong>{analytics.invoices}</strong>
        </div>
        <div className="metric-card">
          Payments <br />
          <strong>{analytics.payments}</strong>
        </div>
        <div className="metric-card">
          Overdue <br />
          <strong>{analytics.overdue}</strong>
        </div>
        <div className="metric-card">
          Success Rate <br />
          <strong>{analytics.successRate}%</strong>
        </div>
      </div>

      <div className="charts-section">
        <div className="charts">
            <div className="chart-box">
          <h4>Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.revenueTrend}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#1888a3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Payment Method Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
  <PieChart>
    <Pie
      data={analytics.paymentMethods}
      dataKey="value"
      nameKey="name"
      cx="40%" 
      cy="50%"
      outerRadius={70}
      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = 25 + outerRadius;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
          <text
            x={x}
            y={y}
            fill="#000"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
          >
            {analytics.paymentMethods[index].value}
          </text>
        );
      }}
    >
      {analytics.paymentMethods.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={COLORS[index % COLORS.length]}
        />
      ))}
    </Pie>
    <Legend layout="vertical" verticalAlign="middle" align="right" />
    <Tooltip />
  </PieChart>
</ResponsiveContainer>

        </div>
        </div>

        <div className="chart-box">
          <h4>Top Customers</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Invoices</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topCustomers.map((cust) => (
                <tr key={cust.name}>
                  <td>{cust.name}</td>
                  <td>{cust.invoices}</td>
                  <td>₹ {cust.paid.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
