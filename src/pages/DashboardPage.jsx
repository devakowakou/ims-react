import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    quantity: {
      label: "Quantity",
      color: "hsl(var(--chart-2))",
    },
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-3))",
    },
  };

const DashboardPage = () => {
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("amount");
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionResponse = await ApiService.getAllTransactions();
        if (transactionResponse.status === 200) {
          setTransactionData(
            transformTransactionData(
              transactionResponse.transactions,
              selectedMonth,
              selectedYear
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching data: " + error
        );
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const transformTransactionData = (transactions, month, year) => {
    const dailyData = {};
    const daysInMonths = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonths; day++) {
      dailyData[day] = {
        day,
        count: 0,
        quantity: 0,
        amount: 0,
      };
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth === month && transactionYear === year) {
        const day = transactionDate.getDate();
        dailyData[day].count += 1;
        dailyData[day].quantity += transaction.totalProducts;
        dailyData[day].amount += transaction.totalPrice;
      }
    });

    return Object.values(dailyData);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(parseInt(value, 10));
  };

  const handleYearChange = (value) => {
    setSelectedYear(parseInt(value, 10));
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        {message && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{message}</div>}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {transactionData.reduce((acc, cur) => acc + cur.count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                    in {new Date(selectedYear, selectedMonth - 1).toLocaleString(\'default\', { month: \'long\', year: \'numeric\' })}
                </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Product Quantity</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {transactionData.reduce((acc, cur) => acc + cur.quantity, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                    in {new Date(selectedYear, selectedMonth - 1).toLocaleString(\'default\', { month: \'long\', year: \'numeric\' })}
                </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Amount</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    ${transactionData.reduce((acc, cur) => acc + cur.amount, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                    in {new Date(selectedYear, selectedMonth - 1).toLocaleString(\'default\', { month: \'long\', year: \'numeric\' })}
                </p>
            </CardContent>
          </Card>
        </div>
        <Card>
            <ChartStyle id="line-chart" config={chartConfig} />
            <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="grid gap-2">
                    <CardTitle>Transaction Analytics</CardTitle>
                    <CardDescription>Monitor your daily transaction metrics</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:ml-auto">
                    <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <SelectItem key={year} value={year.toString()}>
                                {year}
                                </SelectItem>
                            );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-4">
                    <div className="flex flex-col gap-2">
                        <Button onClick={() => setSelectedData(\'count\')} variant={selectedData === \'count\' ? \'outline\' : \'ghost\'}>Total Transactions</Button>
                        <Button onClick={() => setSelectedData(\'quantity\')} variant={selectedData === \'quantity\' ? \'outline\' : \'ghost\'}>Product Quantity</Button>
                        <Button onClick={() => setSelectedData(\'amount\')} variant={selectedData === \'amount\' ? \'outline\' : \'ghost\'}>Amount</Button>
                    </div>
                    <div className="col-span-3">
                        <ChartContainer
                            config={chartConfig}
                            className="min-h-[300px] w-full"
                        >
                            <LineChart data={transactionData} id="line-chart">
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}\
                            />
                            <Line
                                dataKey={selectedData}
                                type="monotone"
                                stroke={`var(--color-${selectedData})`}
                                strokeWidth={2}
                                dot={false}
                            />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
