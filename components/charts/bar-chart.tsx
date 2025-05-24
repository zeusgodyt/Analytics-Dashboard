"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BarChartProps {
  data: any[];
  title: string;
  description?: string;
  categories: { key: string; label: string }[];
  xAxisDataKey: string;
  isLoading?: boolean;
}

export function BarChart({
  data,
  title,
  description,
  categories,
  xAxisDataKey,
  isLoading = false,
}: BarChartProps) {
  const [activeTab, setActiveTab] = React.useState("all");
  const colorScheme = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];
  
  // Filter data based on selected tab
  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return data;
    return data.filter(item => item.category === activeTab);
  }, [data, activeTab]);
  
  // Performance optimization with React.memo
  const MemoizedBarChart = React.memo(() => (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={filteredData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey={xAxisDataKey} 
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickLine={{ stroke: "hsl(var(--border))" }}
          axisLine={{ stroke: "hsl(var(--border))" }}
        />
        <YAxis 
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickLine={{ stroke: "hsl(var(--border))" }}
          axisLine={{ stroke: "hsl(var(--border))" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Bar
            key={category.key}
            dataKey={category.key}
            name={category.label}
            fill={colorScheme[index % colorScheme.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  ));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="product">Products</TabsTrigger>
            <TabsTrigger value="service">Services</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md animate-pulse">
            Loading chart data...
          </div>
        ) : (
          <MemoizedBarChart />
        )}
      </CardContent>
    </Card>
  );
}