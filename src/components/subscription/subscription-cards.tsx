"use client";

import { useState } from "react";
import { CheckCircle2, Crown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  subscriptionPlans,
  updateSubscription,
  type SubscriptionPlan,
} from "@/services/subscription";

interface SubscriptionCardsProps {
  currentPlan: SubscriptionPlan;
  onPlanChange?: () => void;
}

export function SubscriptionCards({
  currentPlan,
  onPlanChange,
}: SubscriptionCardsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan>(currentPlan);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (plan === currentPlan) {
      toast.info("You're already on this plan");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateSubscription(plan);

      if (result.success) {
        toast.success(result.message);
        setSelectedPlan(plan);
        if (onPlanChange) {
          onPlanChange();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update subscription");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
      {(Object.keys(subscriptionPlans) as SubscriptionPlan[]).map((plan) => {
        const details = subscriptionPlans[plan];
        const isCurrentPlan = currentPlan === plan;
        const isPremium = plan === "PREMIUM";

        return (
          <div
            key={plan}
            className={`relative rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md ${
              isCurrentPlan ? "border-primary bg-primary/5" : "border-border"
            } ${isPremium ? "ring-1 ring-primary/30" : ""}`}
          >
            {isPremium && (
              <div className="absolute -top-3 right-4 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{plan}</h3>
              <div className="mt-2 text-3xl font-bold">
                ${plan === "FREE" ? "0" : plan === "BASIC" ? "29" : "99"}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {details.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full"
              variant={
                isCurrentPlan ? "outline" : isPremium ? "default" : "secondary"
              }
              disabled={isLoading || isCurrentPlan}
              onClick={() => handleUpgrade(plan)}
            >
              {isLoading
                ? "Processing..."
                : isCurrentPlan
                ? "Current Plan"
                : "Upgrade"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
