"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PieChartProps {
  data: any[];
  title: string;
  description?: string;
  nameKey: string;
  valueKey: string;
  isLoading?: boolean;
}

export function PieChart({
  data,
  title,
  description,
  nameKey,
  valueKey,
  isLoading = false,
}: PieChartProps) {
  const [chartType, setChartType] = React.useState("pie");
  const colorScheme = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  
  // Performance optimization with React.memo
  const MemoizedPieChart = React.memo(() => (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={chartType === "pie" ? 100 : 100}
          innerRadius={chartType === "pie" ? 0 : 60}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorScheme[index % colorScheme.length]}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--card-foreground))",
          }}
          formatter={(value) => [`${value}`, "Value"]}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  ));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="donut">Donut Chart</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md animate-pulse">
            Loading chart data...
          </div>
        ) : (
          <MemoizedPieChart />
        )}
      </CardContent>
    </Card>
  );
}