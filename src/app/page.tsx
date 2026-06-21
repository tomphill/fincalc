import {
  Calculator,
  DollarSign,
  TrendingUp,
  Calendar,
  Percent,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Mortgage Repayments",
    description:
      "Calculate your monthly mortgage payments, compare different loan terms, and see how interest rates affect your repayments.",
    icon: DollarSign,
    href: "/mortgage",
    benefits: [
      { icon: Calendar, text: "Monthly & total repayment estimates" },
      { icon: Percent, text: "Adjustable interest rates & terms" },
      { icon: TrendingUp, text: "Amortisation schedule breakdown" },
    ],
  },
  {
    title: "Compound Interest",
    description:
      "See how your investments grow over time with compound interest. Project savings, compare frequencies, and plan your financial future.",
    icon: TrendingUp,
    href: "/compound-interest",
    benefits: [
      { icon: Calendar, text: "Annual, monthly & daily compounding" },
      { icon: DollarSign, text: "Initial & recurring contribution support" },
      { icon: TrendingUp, text: "Visual growth projections" },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <Calculator className="size-4" />
          Smart financial tools at your fingertips
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Make sense of your money
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Quick, accurate calculators for mortgages and compound interest — no
          spreadsheets required.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href="/mortgage">
              Mortgage Calculator
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/compound-interest">
              Compound Interest
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-4xl gap-6 px-6 pb-24 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} size="sm" className="flex flex-col">
            <CardHeader>
              <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ul className="space-y-2">
                {feature.benefits.map((benefit) => (
                  <li
                    key={benefit.text}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <benefit.icon className="size-4 shrink-0 text-primary" />
                    {benefit.text}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="mt-auto px-(--card-spacing) pb-(--card-spacing)">
              <Button variant="outline" className="w-full" asChild>
                <Link href={feature.href}>
                  Open {feature.title}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
