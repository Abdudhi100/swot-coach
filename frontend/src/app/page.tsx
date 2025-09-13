"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Unlock Your Potential with{" "}
          <span className="text-primary">SwotCoach</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Turn strengths into action, improve weaknesses, seize opportunities, and overcome threats with structured self-reflection and daily coaching tools
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" onClick={() => router.push("/register")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => {
            document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
          }}>
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 bg-muted/40">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How SwotCoach Helps You
          </h2>
          <p className="mt-4 text-muted-foreground">
            Practical tools to guide your personal and professional development.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-md">
              <CardHeader>
                <Brain className="h-8 w-8 text-primary" />
                <CardTitle className="mt-2">Self-Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                Reflect deeply on your strengths and weaknesses with guided SWOT
                sessions.
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <Target className="h-8 w-8 text-primary" />
                <CardTitle className="mt-2">Focused Growth</CardTitle>
              </CardHeader>
              <CardContent>
                Turn insights into action by setting measurable goals and habits.
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary" />
                <CardTitle className="mt-2">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                Stay accountable with progress tracking and regular reflection.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary text-primary-foreground text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to transform your journey?
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Join SwotCoach today and take the first step toward intentional growth.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-6 font-semibold"
          onClick={() => router.push("/register")}
        >
          Create an Account
        </Button>
      </section>
    </div>
  );
}
