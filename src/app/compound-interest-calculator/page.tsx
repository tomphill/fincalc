"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, Percent, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

type CompoundingFrequency = "annually" | "monthly" | "daily";

interface GrowthRow {
  year: number;
  balance: number;
  yearlyContribution: number;
  yearlyInterest: number;
  totalContributions: number;
  totalInterest: number;
}

interface CompoundResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  schedule: GrowthRow[];
}

function calculateCompoundInterest(
  initialDeposit: number,
  monthlyContribution: number,
  annualRate: number,
  frequency: CompoundingFrequency,
  years: number,
): CompoundResult {
  const rate = annualRate / 100;
  const numMonths = years * 12;
  const monthlyRate = rate / 12;
  const dailyRate = rate / 365;

  let balance = initialDeposit;
  let totalContributions = initialDeposit;
  let totalInterest = 0;
  const schedule: GrowthRow[] = [];

  let startOfYearBalance = balance;
  let yearlyContribution = 0;

  for (let month = 1; month <= numMonths; month++) {
    balance += monthlyContribution;
    totalContributions += monthlyContribution;
    yearlyContribution += monthlyContribution;

    if (frequency === "monthly") {
      const interestEarned = balance * monthlyRate;
      balance += interestEarned;
      totalInterest += interestEarned;
    } else if (frequency === "daily") {
      const interestEarned = balance * (Math.pow(1 + dailyRate, 30) - 1);
      balance += interestEarned;
      totalInterest += interestEarned;
    }

    if (month % 12 === 0) {
      if (frequency === "annually") {
        const interestEarned = balance * rate;
        balance += interestEarned;
        totalInterest += interestEarned;
      }

      const yearNum = month / 12;
      const yearlyInterest = balance - startOfYearBalance - yearlyContribution;

      schedule.push({
        year: yearNum,
        balance,
        yearlyContribution,
        yearlyInterest: Math.max(0, yearlyInterest),
        totalContributions,
        totalInterest,
      });

      startOfYearBalance = balance;
      yearlyContribution = 0;
    }
  }

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest,
    schedule,
  };
}

const FREQUENCY_LABELS: Record<CompoundingFrequency, string> = {
  annually: "Annually",
  monthly: "Monthly",
  daily: "Daily",
};

export default function CompoundInterestCalculatorPage() {
  const [initialDeposit, setInitialDeposit] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [interestRate, setInterestRate] = useState("7");
  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>("monthly");
  const [years, setYears] = useState("10");

  const deposit = Math.max(0, parseFloat(initialDeposit) || 0);
  const contribution = Math.max(0, parseFloat(monthlyContribution) || 0);
  const rate = parseFloat(interestRate) || 0;
  const term = Math.max(1, parseInt(years) || 0);

  const result = useMemo<CompoundResult | null>(() => {
    if (deposit < 0 || rate < 0 || term < 1) return null;
    if (deposit === 0 && contribution === 0) return null;
    return calculateCompoundInterest(
      deposit,
      contribution,
      rate,
      compoundingFrequency,
      term,
    );
  }, [deposit, contribution, rate, compoundingFrequency, term]);

  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 pt-6">
        <Button variant="link" className="px-0 text-muted-foreground" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-4">
            <TrendingUp className="size-4" />
            Compound Interest Calculator
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Compound Interest Calculator
          </h1>
          <p className="mt-2 text-muted-foreground">
            See how your investments grow over time with compound interest.
            Project savings, compare frequencies, and plan your financial
            future.
          </p>
        </div>

        <Tabs defaultValue="calculator">
          <TabsList>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="schedule">Growth Schedule</TabsTrigger>
            <TabsTrigger value="chart">Growth Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Details</CardTitle>
                  <CardDescription>
                    Enter your deposit and contribution details to calculate
                    growth.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialDeposit">Initial Deposit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="initialDeposit"
                        type="number"
                        className="pl-8"
                        value={initialDeposit}
                        onChange={(e) => setInitialDeposit(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyContribution">
                      Monthly Contribution
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="monthlyContribution"
                        type="number"
                        className="pl-8"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Annual Interest Rate</Label>
                    <div className="relative">
                      <Percent className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        className="pl-8"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compoundingFrequency">
                      Compounding Frequency
                    </Label>
                    <Select
                      value={compoundingFrequency}
                      onValueChange={(value: CompoundingFrequency) =>
                        setCompoundingFrequency(value)
                      }
                    >
                      <SelectTrigger
                        id="compoundingFrequency"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years">Time Period (years)</Label>
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Results</CardTitle>
                  <CardDescription>
                    Projected growth of your investments over time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Final Balance
                    </p>
                    <p className="text-4xl font-semibold tracking-tight">
                      {result ? formatCurrency(result.finalBalance) : "—"}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Contributions
                      </p>
                      <p className="text-lg font-medium">
                        {result
                          ? formatCurrency(result.totalContributions)
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Interest Earned
                      </p>
                      <p className="text-lg font-medium">
                        {result ? formatCurrency(result.totalInterest) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Compounding
                      </p>
                      <p className="text-lg font-medium">
                        {FREQUENCY_LABELS[compoundingFrequency]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Investment Period
                      </p>
                      <p className="text-lg font-medium">
                        {term > 0 ? `${term} years` : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Schedule</CardTitle>
                <CardDescription>
                  Year-by-year breakdown of your investment growth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Year
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Balance
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Contributions
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Interest
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pl-4 text-right font-medium">
                            Total Interest
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((row) => (
                          <tr key={row.year} className="border-b last:border-0">
                            <td className="py-2 pr-4">{row.year}</td>
                            <td className="py-2 pr-4">
                              {formatCurrency(row.balance)}
                            </td>
                            <td className="py-2 pr-4">
                              {formatCurrency(row.yearlyContribution)}
                            </td>
                            <td className="py-2 pr-4">
                              {formatCurrency(row.yearlyInterest)}
                            </td>
                            <td className="py-2 pl-4 text-right">
                              {formatCurrency(row.totalInterest)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Enter valid investment details to see the growth schedule.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Projection</CardTitle>
                <CardDescription>
                  Visual representation of your investment balance over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result && result.schedule.length > 0 ? (
                  <div className="h-80 sm:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={result.schedule}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis
                          dataKey="year"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `Year ${v}`}
                          className="text-xs text-muted-foreground"
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={formatCompactCurrency}
                          className="text-xs text-muted-foreground"
                          width={60}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{
                            borderRadius: "var(--radius)",
                            border: "1px solid var(--color-border)",
                            background: "var(--color-card)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="var(--color-primary)"
                          strokeWidth={2}
                          name="Balance"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="totalContributions"
                          stroke="var(--color-muted-foreground)"
                          strokeWidth={2}
                          name="Total Contributions"
                          dot={false}
                          strokeDasharray="4 4"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Enter valid investment details to see the growth chart.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
