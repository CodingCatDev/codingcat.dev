export interface StripeProduct {
  id: string;
  active: boolean;
  description?: string;
  images?: string[];
  name: string;
  role: string;
  prices: StripePrice[];
}

export interface StripePrice {
  id: string;
  active?: boolean;
  currency?: string;
  description?: string;
  interval?: string;
  interval_count?: number;
  trial_period_days?: number;
  type?: string;
  unit_amount?: number;
}

export interface StripeLineItem {
  price: string;
  quantity: number;
}
