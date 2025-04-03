"use client";

import { useState, useEffect } from "react";
import { auth, useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionCards } from "@/components/subscription/subscription-cards";
import { prisma } from "@/lib/db";
import { Plans } from "@prisma/client";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [currentPlan, setCurrentPlan] = useState<Plans | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user's current subscription plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/subscription");
        const data = await response.json();

        if (response.ok) {
          setCurrentPlan(data.plan || "FREE");
        } else {
          console.error("Error fetching subscription:", data.message);
          setCurrentPlan("FREE");
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setCurrentPlan("FREE");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchUserPlan();
    }
  }, [isLoaded, user]);

  const handlePlanChange = () => {
    // Refresh the user's plan after upgrade
    window.location.reload();
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                <p className="text-sm text-muted-foreground">
                  You are currently on the{" "}
                  <span className="font-semibold">{currentPlan}</span> plan.
                </p>
              </div>

              <SubscriptionCards
                currentPlan={currentPlan as any}
                onPlanChange={handlePlanChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Account settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
