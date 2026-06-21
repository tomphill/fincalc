"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, DollarSign, Percent } from "lucide-react";

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number,
): MortgageResult {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) {
    const payment = principal / numPayments;
    const schedule: AmortizationRow[] = [];
    let remaining = principal;
    for (let month = 1; month <= numPayments; month++) {
      const principalPayment = payment;
      remaining -= principalPayment;
      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest: 0,
        remainingBalance: Math.max(0, remaining),
      });
    }
    return {
      monthlyPayment: payment,
      totalPayment: principal,
      totalInterest: 0,
      schedule,
    };
  }

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const schedule: AmortizationRow[] = [];
  let remaining = principal;
  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = remaining * monthlyRate;
    const principalPayment = payment - interestPayment;
    remaining -= principalPayment;
    schedule.push({
      month,
      payment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remaining),
    });
  }

  return {
    monthlyPayment: payment,
    totalPayment: payment * numPayments,
    totalInterest: payment * numPayments - principal,
    schedule,
  };
}

export default function MortgageCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState("300000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [downPayment, setDownPayment] = useState("60000");

  const principal =
    Math.max(0, parseFloat(loanAmount) || 0) -
    Math.max(0, parseFloat(downPayment) || 0);
  const rate = parseFloat(interestRate) || 0;
  const term = Math.max(1, parseInt(loanTerm) || 0);

  const result = useMemo<MortgageResult | null>(() => {
    if (principal <= 0 || rate < 0 || term < 1) return null;
    return calculateMortgage(principal, rate, term);
  }, [principal, rate, term]);

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
            <Calculator className="size-4" />
            Mortgage Calculator
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Mortgage Repayments Calculator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Calculate your monthly mortgage payments and see the full
            amortisation schedule.
          </p>
        </div>

        <Tabs defaultValue="calculator">
          <TabsList>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="amortization">
              Amortisation Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Details</CardTitle>
                  <CardDescription>
                    Enter your loan information to calculate repayments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="loanAmount"
                        type="number"
                        className="pl-8"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="downPayment"
                        type="number"
                        className="pl-8"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
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
                    <Label htmlFor="loanTerm">Loan Term (years)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Repayments</CardTitle>
                  <CardDescription>
                    Estimated monthly and total costs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Monthly Payment
                    </p>
                    <p className="text-4xl font-semibold tracking-tight">
                      {result ? formatCurrency(result.monthlyPayment) : "—"}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Payment
                      </p>
                      <p className="text-lg font-medium">
                        {result ? formatCurrency(result.totalPayment) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Interest
                      </p>
                      <p className="text-lg font-medium">
                        {result ? formatCurrency(result.totalInterest) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Principal Amount
                      </p>
                      <p className="text-lg font-medium">
                        {formatCurrency(principal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Number of Payments
                      </p>
                      <p className="text-lg font-medium">
                        {term > 0 && principal > 0 ? term * 12 : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="amortization" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Amortisation Schedule</CardTitle>
                <CardDescription>
                  Monthly breakdown of principal and interest payments
                  throughout the loan term.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Month
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Payment
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Principal
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                            Interest
                          </th>
                          <th className="sticky top-0 bg-card pb-2 pl-4 text-right font-medium">
                            Remaining Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((row) => (
                          <tr
                            key={row.month}
                            className="border-b last:border-0"
                          >
                            <td className="py-2 pr-4">{row.month}</td>
                            <td className="py-2 pr-4">
                              {formatCurrency(row.payment)}
                            </td>
                            <td className="py-2 pr-4">
                              {formatCurrency(row.principal)}
                            </td>
                            <td className="py-2 pr-4">
                              {formatCurrency(row.interest)}
                            </td>
                            <td className="py-2 pl-4 text-right">
                              {formatCurrency(row.remainingBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Enter valid loan details to see the amortisation schedule.
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
