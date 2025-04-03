export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM';

export interface SubscriptionDetails {
  plan: SubscriptionPlan;
  credits: number;
  maxDomains: number;
  features: string[];
}

export const subscriptionPlans: Record<SubscriptionPlan, SubscriptionDetails> = {
  FREE: {
    plan: 'FREE',
    credits: 1000,
    maxDomains: 1,
    features: [
      '1 domain',
      'Up to 1,000 email credits',
      'Basic AI chat capabilities',
      'Standard support'
    ]
  },
  BASIC: {
    plan: 'BASIC',
    credits: 5000,
    maxDomains: 3,
    features: [
      'Up to 3 domains',
      'Up to 5,000 email credits',
      'Advanced AI chat capabilities',
      'Priority support',
      'Email campaign scheduling'
    ]
  },
  PREMIUM: {
    plan: 'PREMIUM',
    credits: 10000,
    maxDomains: 10,
    features: [
      'Up to 10 domains',
      'Up to 10,000 email credits',
      'Premium AI chat capabilities',
      '24/7 priority support',
      'Advanced analytics',
      'Custom integrations'
    ]
  }
};

export const updateSubscription = async (plan: SubscriptionPlan): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update subscription');
    }
    
    return { 
      success: true, 
      message: data.message || 'Subscription updated successfully' 
    };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { 
      success: false, 
      message: (error as Error).message || 'An error occurred while updating subscription'
    };
  }
};