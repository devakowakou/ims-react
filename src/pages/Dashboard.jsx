import React from "react";
import Layout from "../components/component/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <Layout>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="bg-white border shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Welcome to your Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">
            <p>This is a placeholder for your dashboard content. You can add any components or information you want to display here.</p>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default Dashboard;
