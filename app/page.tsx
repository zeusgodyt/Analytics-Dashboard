"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Activity, BarChart4, DollarSign, Users } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { ErrorBoundary } from "@/components/dashboard/error-boundary";
import {
  generateTimeSeriesData,
  generateRevenueData,
  generateDistributionData,
  generateKPIs,
  exportToCSV,
} from "@/lib/chart-data";

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const timeSeriesData = generateTimeSeriesData(dateRange);
      setTimeSeriesData(timeSeriesData);
      setRevenueData(generateRevenueData());
      setDistributionData(generateDistributionData());
      setKpis(generateKPIs());
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleExportData = () => {
    exportToCSV(timeSeriesData, "analytics-data");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onDateChange={handleDateChange} onExport={handleExportData} />
      
      <main className="container mx-auto px-4 py-6">
        <ErrorBoundary>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard
              title="Total Visitors"
              value={kpis?.visitors.value || 0}
              description={kpis?.visitors.description}
              trend={kpis?.visitors.trend}
              icon={<Users />}
              isLoading={isLoading}
              historicalData={timeSeriesData.map(item => ({
                date: item.date,
                value: item.visitors
              }))}
            />
            <KpiCard
              title="Conversions"
              value={kpis?.conversions.value || 0}
              description={kpis?.conversions.description}
              trend={kpis?.conversions.trend}
              icon={<Activity />}
              isLoading={isLoading}
              historicalData={timeSeriesData.map(item => ({
                date: item.date,
                value: item.conversions
              }))}
            />
            <KpiCard
              title="Total Revenue"
              value={kpis?.revenue.value || "$0"}
              description={kpis?.revenue.description}
              trend={kpis?.revenue.trend}
              icon={<DollarSign />}
              isLoading={isLoading}
              historicalData={revenueData.map(item => ({
                date: item.month,
                value: item.revenue
              }))}
            />
            <KpiCard
              title="Average Order Value"
              value={kpis?.avgOrder.value || "$0"}
              description={kpis?.avgOrder.description}
              trend={kpis?.avgOrder.trend}
              icon={<BarChart4 />}
              isLoading={isLoading}
              historicalData={revenueData.map(item => ({
                date: item.month,
                value: item.revenue / 30
              }))}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LineChart
              title="Traffic Overview"
              description="Visitors, pageviews, and conversions over time"
              data={timeSeriesData}
              dataKeys={["visitors", "pageviews", "conversions"]}
              xAxisDataKey="date"
              isLoading={isLoading}
            />
            <BarChart
              title="Revenue Analysis"
              description="Revenue, costs, and profit by month"
              data={revenueData}
              categories={[
                { key: "revenue", label: "Revenue" },
                { key: "costs", label: "Costs" },
                { key: "profit", label: "Profit" },
              ]}
              xAxisDataKey="month"
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <PieChart
              title="Traffic Sources"
              description="Distribution of traffic by channel"
              data={distributionData}
              nameKey="name"
              valueKey="value"
              isLoading={isLoading}
            />
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}