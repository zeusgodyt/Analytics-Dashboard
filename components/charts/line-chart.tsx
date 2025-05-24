import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LineChartProps {
  data: any[];
  title: string;
  description?: string;
  dataKeys: string[];
  xAxisDataKey: string;
  isLoading?: boolean;
  height?: number;
}

export function LineChart({
  data,
  title,
  description,
  dataKeys,
  xAxisDataKey,
  isLoading = false,
  height = 300,
}: LineChartProps) {
  const [timeframe, setTimeframe] = useState("all");
  const colorScheme = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];
  
  // Filter data based on selected timeframe
  const filteredData = React.useMemo(() => {
    if (timeframe === "all") return data;
    
    const now = new Date();
    let filterDate = new Date();
    
    switch (timeframe) {
      case "7days":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        filterDate.setDate(now.getDate() - 90);
        break;
      default:
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= filterDate);
  }, [data, timeframe]);

  // Performance optimization with React.memo
  const MemoizedLineChart = React.memo(() => (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
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
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colorScheme[index % colorScheme.length]}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  ));

  if (!title) {
    return isLoading ? (
      <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md animate-pulse">
        Loading chart data...
      </div>
    ) : (
      <MemoizedLineChart />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md animate-pulse">
            Loading chart data...
          </div>
        ) : (
          <MemoizedLineChart />
        )}
      </CardContent>
    </Card>
  );
}