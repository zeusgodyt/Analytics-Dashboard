// Mock data generator for the analytics dashboard
import { DateRange } from "react-day-picker";
import { addDays, format, subDays, subMonths } from "date-fns";

// Generate time series data for line chart
export function generateTimeSeriesData(
  range: DateRange | undefined = {
    from: subMonths(new Date(), 3),
    to: new Date(),
  }
) {
  const data = [];
  const startDate = range?.from || subMonths(new Date(), 3);
  const endDate = range?.to || new Date();
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Add some randomness to data points
    const visitors = Math.floor(Math.random() * 2000) + 1000;
    const pageviews = visitors * (Math.random() * 3 + 2);
    const conversions = visitors * (Math.random() * 0.15);
    
    data.push({
      date: format(currentDate, "yyyy-MM-dd"),
      visitors: Math.round(visitors),
      pageviews: Math.round(pageviews),
      conversions: Math.round(conversions),
    });
    
    currentDate = addDays(currentDate, 1);
  }
  
  return data;
}

// Generate revenue data for bar chart
export function generateRevenueData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  
  return months.map(month => {
    const category = Math.random() > 0.5 ? "product" : "service";
    const revenue = Math.floor(Math.random() * 50000) + 10000;
    const costs = revenue * (Math.random() * 0.6 + 0.2);
    const profit = revenue - costs;
    
    return {
      month,
      category,
      revenue: Math.round(revenue),
      costs: Math.round(costs),
      profit: Math.round(profit),
    };
  });
}

// Generate distribution data for pie chart
export function generateDistributionData() {
  const channels = [
    { name: "Organic Search", value: Math.floor(Math.random() * 5000) + 3000 },
    { name: "Direct", value: Math.floor(Math.random() * 3000) + 2000 },
    { name: "Social Media", value: Math.floor(Math.random() * 2500) + 1000 },
    { name: "Email", value: Math.floor(Math.random() * 2000) + 800 },
    { name: "Referral", value: Math.floor(Math.random() * 1500) + 500 },
  ];
  
  return channels;
}

// Generate KPI data
export function generateKPIs() {
  return {
    visitors: {
      value: Math.floor(Math.random() * 50000) + 20000,
      trend: {
        value: Math.floor(Math.random() * 20) - 5,
        isPositive: Math.random() > 0.3,
      },
      description: "vs. previous period",
    },
    conversions: {
      value: Math.floor(Math.random() * 5000) + 1000,
      trend: {
        value: Math.floor(Math.random() * 30),
        isPositive: Math.random() > 0.3,
      },
      description: "vs. previous period",
    },
    revenue: {
      value: `$${(Math.floor(Math.random() * 100000) + 50000).toLocaleString()}`,
      trend: {
        value: Math.floor(Math.random() * 25),
        isPositive: Math.random() > 0.3,
      },
      description: "vs. previous period",
    },
    avgOrder: {
      value: `$${(Math.floor(Math.random() * 300) + 50).toLocaleString()}`,
      trend: {
        value: Math.floor(Math.random() * 15),
        isPositive: Math.random() > 0.4,
      },
      description: "vs. previous period",
    },
  };
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string = "dashboard-data") {
  if (!data.length) return null;
  
  // Get headers from first data object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header];
        // Handle special characters and ensure proper CSV formatting
        return typeof cell === "string" && cell.includes(",") 
          ? `"${cell}"` 
          : cell;
      }).join(",")
    )
  ];
  
  // Combine into CSV content
  const csvContent = csvRows.join("\n");
  
  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Create and trigger download
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}