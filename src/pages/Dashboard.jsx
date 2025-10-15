
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../component/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../component/ui/table";
import { Badge } from "../component/ui/badge";
import { Button } from "../component/ui/button";
import Layout from "../layout/Layout";
import TransactionService from "../service/TransactionService";
import ProductService from "../service/ProductService";
import SupplierService from "../service/SupplierService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown, AlertTriangle, FileText, RefreshCw } from "lucide-react";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "../component/SkeletonCard";

// Helper function to format numbers as currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    salesChange: 0,
    purchasesChange: 0,
  });
  const [barChartData, setBarChartData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the fetchData function to prevent recreation on every render
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        // Fetch transactions, products, and suppliers
        const [transactionResponse, productResponse, supplierResponse] = await Promise.all([
          TransactionService.getAllTransactions(),
          ProductService.getAllProducts(),
          SupplierService.getAllSuppliers()
        ]);

        // --- Process Data for Stat Cards ---
        if (transactionResponse.status === 200) {
          const transactions = transactionResponse.transactions;
          const now = new Date();
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

          const currentMonthSales = transactions
            .filter(t => new Date(t.createdAt) > new Date(now.getFullYear(), now.getMonth(), 1) && t.type === 'sale')
            .reduce((sum, t) => sum + t.totalPrice, 0);
          
          const lastMonthSales = transactions
            .filter(t => new Date(t.createdAt) >= lastMonth && new Date(t.createdAt) < new Date(now.getFullYear(), now.getMonth(), 1) && t.type === 'sale')
            .reduce((sum, t) => sum + t.totalPrice, 0);

          const salesChange = lastMonthSales > 0 ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100 : currentMonthSales > 0 ? 100 : 0;
            
          setStats(prevStats => ({
            ...prevStats,
            totalSales: transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.totalPrice, 0),
            totalPurchases: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.totalPrice, 0),
            salesChange: salesChange,
          }));

          // --- Process Data for Recent Transactions Table ---
          setRecentTransactions(transactions.slice(0, 3)); // Assuming the API returns them sorted by date

          // --- Process Data for Bar Chart ---
          const monthlyData = Array(6).fill(0).map((_, i) => {
              const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const monthName = month.toLocaleString('default', { month: 'short' });
              return { name: monthName, sales: 0, purchases: 0 };
          }).reverse();

          transactions.forEach(t => {
              const monthIndex = 5 - (now.getMonth() - new Date(t.createdAt).getMonth());
              if (monthIndex >= 0 && monthIndex < 6) {
                  if (t.type === 'sale') monthlyData[monthIndex].sales += t.totalPrice;
                  if (t.type === 'purchase') monthlyData[monthIndex].purchases += t.totalPrice;
              }
          });
          setBarChartData(monthlyData);
        }

        // --- Process Data for Products & Suppliers ---
        if (productResponse.status === 200) {
          const products = productResponse.products;
          setStats(prevStats => ({ ...prevStats, totalProducts: products.length }));

          // --- Process Data for Stock Alerts Table ---
          setStockAlerts(products.filter(p => p.stock < 10).slice(0, 3));

          // --- Process Data for Pie Chart ---
          const categoryCounts = products.reduce((acc, product) => {
            const category = product.category || 'Other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});
          
          const pieData = Object.keys(categoryCounts).map(name => ({
            name,
            value: categoryCounts[name],
          }));
          setPieChartData(pieData);
        }
        
        if (supplierResponse.status === 200) {
            setStats(prevStats => ({ ...prevStats, totalSuppliers: supplierResponse.suppliers.length }));
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
  }, []); // Empty dependency array - function is stable

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <Layout>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your inventory management system.
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </div>

        {/* Stat Cards Section */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 animate-fade-in animate-delay-100">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
          {/* Total Sales Card */}
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalSales)}</div>
              <div className="flex items-center text-xs mt-2">
                {stats.salesChange >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+{stats.salesChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-red-600 font-medium">{stats.salesChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Purchases Card */}
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{formatCurrency(stats.totalPurchases)}</div>
              <p className="text-xs text-muted-foreground mt-2">Total inventory investment</p>
            </CardContent>
          </Card>

          {/* Total Products Card */}
          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-2">Active in inventory</p>
            </CardContent>
          </Card>

          {/* Total Suppliers Card */}
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.totalSuppliers}</div>
              <p className="text-xs text-muted-foreground mt-2">Active partnerships</p>
            </CardContent>
          </Card>
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 animate-fade-in animate-delay-200">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Sales and Purchases Overview</CardTitle>
              <CardDescription>Last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Sales" />
                  <Bar dataKey="purchases" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution of products by category.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/category')}>
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => {
                      const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];
                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 animate-fade-in animate-delay-300">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your 3 most recent transactions.</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/transaction')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((t, i) => (
                      <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <Badge variant={t.type === 'sale' ? 'default' : 'secondary'} className="capitalize">
                            {t.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(t.totalPrice)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No recent transactions</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <div>
                    <CardTitle>Stock Alerts</CardTitle>
                    <CardDescription>Products running low on stock.</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/product')}>
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stockAlerts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockAlerts.map((p, i) => (
                      <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="font-semibold">
                            {p.stock} units
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">All products are well stocked</p>
                  <p className="text-xs text-muted-foreground mt-1">Great job! 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
