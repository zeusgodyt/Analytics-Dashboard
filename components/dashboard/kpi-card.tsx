import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart } from "@/components/charts/line-chart";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
  historicalData?: any[];
}

export function KpiCard({
  title,
  value,
  description,
  icon,
  trend,
  isLoading = false,
  className,
  historicalData,
}: KpiCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card 
        className={cn("overflow-hidden cursor-pointer transition-all hover:shadow-lg", className)}
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[140px]" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {trend ? (
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span
                    className={cn(
                      "mr-1 text-xs",
                      trend.isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                  {description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-muted-foreground">{icon}</span>
              {title} Details
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{value}</h3>
              {trend && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <span
                    className={cn(
                      "mr-1",
                      trend.isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                  {description}
                </p>
              )}
            </div>
            {historicalData && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Historical Trend</h4>
                <LineChart
                  data={historicalData}
                  title=""
                  dataKeys={["value"]}
                  xAxisDataKey="date"
                  height={200}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}