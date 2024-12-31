import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ArrowUp, ArrowDown, TrendingDown, AlertTriangle, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useAxios from '../hooks/useAxios';
import { Bars3Icon } from '@heroicons/react/24/outline';
import TransactionDistributionChart from '../components/TransactionDistributionChart';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import EscrowDashboard from '../components/EscrowDashboard';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="text-zinc-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState({});
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'year'
  const [escrowData, setEscrowData] = useState([]);
  const [topTutors, setTopTutors] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, bookingsRes, escrowRes] = await Promise.all([
          axiosInstance.get('transactions/'),
          axiosInstance.get('bookings/'),
          axiosInstance.get('escrow/')
        ]);
        console.log('escrowdata', escrowRes);
        const bookingsData = bookingsRes.data;
        setTransactions(transactionsRes.data);
        setBookings(bookingsData);
        setEscrowData(escrowRes.data)

        const refundBookings = bookingsData.filter(
          booking => booking.refund_status && 
                    booking.student_joined_within_5_min && 
                    !booking.tutor_joined_within_5_min
        );

        // Fetch availability details for refund-eligible bookings
        const availabilityIds = [...new Set(refundBookings.map(b => b.availability))];
        
        const availabilityData = {};
        await Promise.all(
          availabilityIds.map(async (availId) => {
            try {
              const response = await axiosInstance.get(`tutor-availabilities/${availId}/`);
              availabilityData[availId] = response.data;
            } catch (error) {
              console.error(`Error fetching availability ${availId}:`, error);
            }
          })
        );

        setAvailabilities(availabilityData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTopPerformers = (bookingsData) => {
    // Filter completed standard sessions
    const completedStandardSessions = bookingsData.filter(
      booking => booking.booking_status === 'completed' && 
      booking.availability.session_type === 'standard'
    );
  
    // Process tutors
    const tutorSessions = completedStandardSessions.reduce((acc, booking) => {
      const tutorId = booking.availability.tutor_id;
      acc[tutorId] = acc[tutorId] || { id: tutorId, name: booking.tutor_name, count: 0 };
      acc[tutorId].count += 1;
      return acc;
    }, {});
  
    // Process students
    const studentSessions = completedStandardSessions.reduce((acc, booking) => {
      const studentId = booking.student_id;
      acc[studentId] = acc[studentId] || { id: studentId, name: booking.student_name, count: 0 };
      acc[studentId].count += 1;
      return acc;
    }, {});
  
    // Sort and get top 5
    const sortedTutors = Object.values(tutorSessions)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const sortedStudents = Object.values(studentSessions)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  
    setTopTutors(sortedTutors);
    setTopStudents(sortedStudents);
  };

  const calculateRefundCreditsExpense = (booking) => {
    if (
      booking.refund_status &&
      booking.student_joined_within_5_min &&
      !booking.tutor_joined_within_5_min
    ) {
      const availability = availabilities[booking.availability];
      if (!availability) return 0;

      const baseCredits = Number(availability?.credits_required);
      const bonusCredits = Math.floor(baseCredits * 0.1);
      return bonusCredits * 150;
    }
    return 0;
  };

  const getTimeframeDate = () => {
    const now = new Date();
    const timeframeDate = new Date();
    
    switch(timeframe) {
      case 'week':
        timeframeDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        timeframeDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        timeframeDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    return timeframeDate;
  };

  const filterByTimeframe = (data, dateField) => {
    const timeframeDate = getTimeframeDate();
    return data.filter(item => new Date(item[dateField]) >= timeframeDate);
  };

  // Calculate dashboard statistics
  const calculateStats = () => {
    const filteredTransactions = filterByTimeframe(transactions, 'transaction_date');
    const filteredBookings = filterByTimeframe(bookings, 'created_at');
  
    const revenue = filteredTransactions
      .filter(t => t.transaction_type === 'credit_purchase' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
    const totalWithdrawals = filteredTransactions
      .filter(t => t.transaction_type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalRefundCreditsExpenses = filteredBookings
      .reduce((sum, booking) => sum + calculateRefundCreditsExpense(booking), 0);
  
    const platformProfit = revenue - totalWithdrawals;
  
    return {
      revenue,
      platformProfit,
      totalWithdrawals,
      totalRefundCreditsExpenses
    };
  };

  const stats = calculateStats();
  // Prepare chart data
  const prepareMonthlyData = () => {
    const timeframeDate = getTimeframeDate();
    const monthlyData = {};
    
    const filteredTransactions = filterByTimeframe(transactions, 'transaction_date');
    const filteredBookings = filterByTimeframe(bookings, 'created_at');
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.transaction_date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
          revenue: 0,
          fees: 0,
          withdrawals: 0,
          refundCreditsExpenses: 0,
          profit: 0
        };
      }

      if (transaction.status === 'completed') {
        switch (transaction.transaction_type) {
          case 'credit_purchase':
            monthlyData[monthKey].revenue += parseFloat(transaction.amount);
            break;
          case 'withdrawal':
            monthlyData[monthKey].withdrawals += parseFloat(transaction.amount);
            break;
        }
      }
    });

    filteredBookings.forEach(booking => {
      const date = new Date(booking.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (monthlyData[monthKey]) {
        const refundExpense = calculateRefundCreditsExpense(booking);
        monthlyData[monthKey].refundCreditsExpenses += refundExpense;
      }
    });

    Object.values(monthlyData).forEach(month => {
      month.profit = month.revenue - month.withdrawals - month.refundCreditsExpenses;
    });

    return Object.values(monthlyData);
  };

  const getTransactionTypeData = () => {
    const filteredTransactions = filterByTimeframe(transactions, 'transaction_date');
    
    return Object.entries(
      filteredTransactions.reduce((acc, t) => {
        if (t.status === 'completed' && ['withdrawal', 'credit_purchase'].includes(t.transaction_type)) {
          acc[t.transaction_type] = (acc[t.transaction_type] || 0) + parseFloat(t.amount);
        }
        return acc;
      }, {})
    ).map(([name, value]) => ({
      name: name === 'credit_purchase' ? 'Credit Purchase' : 'Withdrawals',
      value: Math.round(value)
    }));
  };

  const monthlyData = prepareMonthlyData();
  const transactionTypeData = getTransactionTypeData();
  const filteredTransactions = filterByTimeframe(transactions, 'transaction_date');

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b'];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <div className="bg-black rounded-lg border border-zinc-800 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">
            {typeof value === 'number' ? value : value}
          </h3>
          {trend && (
            <div className="flex items-center mt-2">
              {trendValue >= 0 ? (
                <ArrowUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                trendValue >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {Math.abs(trendValue)}%
              </span>
              <span className="text-zinc-400 text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-zinc-900 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title and Date
    doc.setFontSize(18);
    doc.text('Financial Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
  
    // Summary Statistics
    doc.setFontSize(14);
    doc.text('Financial Overview', 14, 35);
    
    const summaryData = [
      ['Revenue', `Rs. ${stats.revenue}`],
      ['Total Withdrawals', `Rs. ${stats.totalWithdrawals}`],
      ['Refund Credits Expenses', `Rs. ${stats.totalRefundCreditsExpenses}`],
      ['Platform Profit', `Rs. ${stats.platformProfit}`]
    ];
  
    doc.autoTable({
      startY: 40,
      head: [['Metric', 'Amount']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14 }
    });
  
    // Monthly Data Chart
    doc.addPage();
    doc.text('Monthly Revenue Overview', 14, 15);
    
    // Convert chart data to table format
    const monthlyTableData = monthlyData.map(month => [
      month.month,
      `Rs. ${month.revenue}`,
      `Rs. ${month.withdrawals}`,
      `Rs. ${month.refundCreditsExpenses}`,
      `Rs. ${month.profit}`
    ]);
  
    doc.autoTable({
      startY: 20,
      head: [['Month', 'Revenue', 'Withdrawals', 'Refund Credits Expenses', 'Profit']],
      body: monthlyTableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14 }
    });
  
    // Transactions Detail
    doc.addPage();
    doc.text('Transaction Details', 14, 15);
    
    const transactionRows = filteredTransactions.map(t => [
      new Date(t.transaction_date).toLocaleDateString(),
      t.reference_id,
      t.transaction_type === 'credit_purchase' ? 'Credit Purchase' : 'Withdrawal',
      `Rs. ${t.amount}`,
      t.status.charAt(0).toUpperCase() + t.status.slice(1)
    ]);
  
    doc.autoTable({
      startY: 20,
      head: [['Date', 'Reference ID', 'Type', 'Amount', 'Status']],
      body: transactionRows,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14 }
    });
  
    doc.save('Financial_Report.pdf');
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
  
    // Summary Statistics
    const summarySheetData = [
      ['Metric', 'Amount'],
      ['Revenue', `Rs. ${stats.revenue}`],
      ['Total Withdrawals', `Rs. ${stats.totalWithdrawals}`],
      ['Refund Credits Expenses', `Rs. ${stats.totalRefundCreditsExpenses}`],
      ['Platform Profit', `Rs. ${stats.platformProfit}`]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Financial Overview');
  
    // Monthly Data
    const monthlySheetData = [
      ['Month', 'Revenue', 'Withdrawals', 'Refund Credits Expenses', 'Profit'],
      ...monthlyData.map(month => [
        month.month,
        `Rs. ${month.revenue}`,
        `Rs. ${month.withdrawals}`,
        `Rs. ${month.refundCreditsExpenses}`,
        `Rs. ${month.profit}`
      ])
    ];
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlySheetData);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Revenue Overview');
  
    // Transactions Detail
    const transactionSheetData = [
      ['Date', 'Reference ID', 'Type', 'Amount', 'Status'],
      ...filteredTransactions.map(t => [
        new Date(t.transaction_date).toLocaleDateString(),
        t.reference_id,
        t.transaction_type === 'credit_purchase' ? 'Credit Purchase' : 'Withdrawal',
        `Rs. ${t.amount}`,
        t.status.charAt(0).toUpperCase() + t.status.slice(1)
      ])
    ];
    const transactionSheet = XLSX.utils.aoa_to_sheet(transactionSheetData);
    XLSX.utils.book_append_sheet(workbook, transactionSheet, 'Transaction Details');
  
    // Save Excel File
    XLSX.writeFile(workbook, 'Financial_Report.xlsx');
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar>
        <button 
          className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </AdminNavbar>
      
      <div className="flex pt-16">
        <AdminSidebar 
          items={[
            { label: 'Dashboard', active: true },
            { label: 'Manage Users', active: false },
            { label: 'Sessions', active: false },
          ]} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Financial Dashboard</h1>
                <p className="text-sm text-zinc-400">Overview of your platform's financial performance</p>
              </div>
              
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" className="text-white" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Revenue"
                  value={`₹${stats.revenue}`}
                  icon={DollarSign}  // DollarSign is appropriate here as it represents total money flow
                />

                <StatCard
                  title="Total Withdrawals"
                  value={`₹${stats.totalWithdrawals}`}
                  icon={TrendingDown}  // TrendingDown shows money leaving the platform
                />

                <StatCard
                  title="Refund Credits Expenses"
                  value={`₹${stats.totalRefundCreditsExpenses}`}
                  icon={AlertTriangle}  // AlertTriangle represents potential risk/contingent expenses
                />

                <StatCard
                  title="Platform Profit"
                  value={`₹${stats.platformProfit}`}
                  icon={TrendingUp}  // TrendingUp shows positive financial outcome
                />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-black rounded-lg border border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Monthly Revenue Overview</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="month" stroke="#71717a" />
                          <YAxis stroke="#71717a" />
                          <Tooltip 
                            content={<CustomBarTooltip />}
                            cursor={{ fill: 'transparent' }} // Removes hover background
                          />
                          <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="withdrawals" name="Withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="refundCreditsExpenses" name="Refund Credits Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="profit" name="Profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <TransactionDistributionChart data={transactionTypeData} />
                </div>

                <div className="bg-black rounded-lg border border-zinc-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-800">
                    <h3 className="text-lg font-semibold text-white">Transactions</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="max-h-[500px] overflow-y-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-zinc-900 border-b border-zinc-800">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400">Reference ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {filteredTransactions.map((transaction, index) => (
                            <tr key={index} className="hover:bg-zinc-900/50">
                              <td className="px-6 py-4 text-sm text-zinc-300">
                                {new Date(transaction.transaction_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-zinc-300">
                                {transaction.reference_id || '-'}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${
                                  transaction.transaction_type === 'credit_purchase' 
                                    ? 'text-green-600'
                                    : ' text-red-600 borde'
                                }`}>
                                  {transaction.transaction_type === 'credit_purchase' ? 'Credit Purchase' : 'Withdrawal'}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm font-medium ${
                                transaction.transaction_type === 'credit_purchase' 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {transaction.transaction_type === 'credit_purchase' ? '+' : '-'}
                                ₹{parseFloat(transaction.amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                                  transaction.status === 'completed' ? 'text-green-600' :
                                  transaction.status === 'refunded' ? 'text-blue-600' :
                                  transaction.status === 'pending' ? 'text-orange-600' :
                                  transaction.status === 'failed' ? 'text-red-600' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 space-x-4">
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Download as PDF
                  </button>
                  <button
                    onClick={exportToExcel} // Button for downloading Excel
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Download Excel
                  </button>
                </div>
                <div className="mb-6">  {/* Added margin-bottom for spacing */}
                  <EscrowDashboard escrowData={escrowData} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
  <div className="bg-black rounded-lg border border-zinc-800 p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Top Tutors</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-800">
            <th className="text-left pb-3">Name</th>
            <th className="text-right pb-3">Completed Sessions</th>
          </tr>
        </thead>
        <tbody>
          {topTutors.map((tutor) => (
            <tr key={tutor.id} className="border-b border-zinc-800">
              <td className="py-3">{tutor.name}</td>
              <td className="text-right py-3">{tutor.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  <div className="bg-black rounded-lg border border-zinc-800 p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Top Students</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-800">
            <th className="text-left pb-3">Name</th>
            <th className="text-right pb-3">Completed Sessions</th>
          </tr>
        </thead>
        <tbody>
          {topStudents.map((student) => (
            <tr key={student.id} className="border-b border-zinc-800">
              <td className="py-3">{student.name}</td>
              <td className="text-right py-3">{student.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;