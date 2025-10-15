
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../component/ui/card";
import { BarChart, PieChart } from "../component/ui/chart";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../component/ui/table";
import { Badge } from "../component/ui/badge";
import Layout from "../layout/Layout";
import TransactionService from "../service/TransactionService";
import ProductService from "../service/ProductService";
import SupplierService from "../service/SupplierService";

// Helper function to format numbers as currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const Dashboard = () => {
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

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, []);


  return (
    <Layout>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Stat Cards Section */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatCurrency(stats.totalSales)}</p>
              <p className="text-xs text-muted-foreground">{stats.salesChange.toFixed(2)}% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatCurrency(stats.totalPurchases)}</p>
              {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalProducts}</p>
              {/* <p className="text-xs text-muted-foreground">+201 since last month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalSuppliers}</p>
              {/* <p className="text-xs text-muted-foreground">+3 since last month</p> */}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Sales and Purchases Overview</CardTitle>
              <CardDescription>Last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={barChartData}
                className="aspect-[4/3]"
                xAxisKey="name"
                series={[{ key: "sales", color: "hsl(var(--primary))"}, {key: "purchases", color: "hsl(var(--secondary))"}]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution of products by category.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <PieChart
                data={pieChartData}
                className="aspect-square"
                dataKey="value"
                nameKey="name"
              />
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your 3 most recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <TableRow key={i}>
                      <TableCell><Badge variant={t.type === 'sale' ? 'default' : 'secondary'}>{t.type}</Badge></TableCell>
                      <TableCell>{formatCurrency(t.totalPrice)}</TableCell>
                      <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Products running low on stock.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockAlerts.map((p, i) => (
                    <TableRow key={i}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell><Badge variant="destructive">{p.stock} units</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
