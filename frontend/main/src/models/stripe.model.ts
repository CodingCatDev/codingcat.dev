import { Timestamp } from 'firebase/firestore';
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
  mode?: string;
  price: string;
  quantity?: number;
}

export interface StripeSubscription {
  role?: null;
  trial_end?: null;
  prices?: string[];
  cancel_at?: null;
  cancel_at_period_end?: boolean;
  created?: Timestamp;
  status?: string;
  ended_at?: null;
  quantity?: number;
  product?: string;
  stripeLink?: string;
  trial_start?: null;
  metadata?: any;
  price?: string;
  canceled_at?: null;
}

export interface StripeInvoice {
  next_payment_attempt?: null;
  attempted?: boolean;
  paid?: boolean;
  custom_fields?: null;
  livemode?: boolean;
  collection_method?: string;
  customer_name?: null;
  account_country?: string;
  number?: string;
  hosted_invoice_url?: string;
  billing_reason?: string;
  lines?: Lines;
  statement_descriptor?: null;
  payment_settings?: PaymentSettings;
  period_start?: number;
  receipt_number?: null;
  amount_remaining?: number;
  account_name?: string;
  transfer_data?: null;
  description?: null;
  account_tax_ids?: null;
  discounts?: any[];
  customer_email?: string;
  starting_balance?: number;
  due_date?: null;
  charge?: string;
  customer_shipping?: null;
  invoice_pdf?: string;
  customer?: string;
  customer_tax_ids?: any[];
  customer_address?: null;
  default_payment_method?: null;
  period_end?: number;
  metadata?: Metadata;
  application_fee_amount?: null;
  discount?: null;
  total?: number;
  tax?: null;
  customer_tax_exempt?: string;
  post_payment_credit_notes_amount?: number;
  ending_balance?: number;
  pre_payment_credit_notes_amount?: number;
  created?: number;
  default_tax_rates?: any[];
  amount_paid?: number;
  status?: string;
  on_behalf_of?: null;
  webhooks_delivered_at?: null;
  object?: string;
  attempt_count?: number;
  default_source?: null;
  customer_phone?: null;
  total_discount_amounts?: any[];
  currency?: string;
  id?: string;
  auto_advance?: boolean;
  total_tax_amounts?: any[];
  status_transitions?: StatusTransitions;
  subtotal?: number;
  footer?: null;
  tax_percent?: null;
  payment_intent?: string;
  subscription?: string;
  last_finalization_error?: null;
  amount_due?: number;
  subCollection?: Metadata;
}

export interface Lines {
  data?: Datum[];
  has_more?: boolean;
  url?: string;
  object?: string;
  total_count?: number;
}

export interface Datum {
  invoice_item?: string;
  subscription?: string;
  discount_amounts?: any[];
  currency?: string;
  period?: Period;
  tax_rates?: any[];
  unique_id?: string;
  object?: string;
  discountable?: boolean;
  id?: string;
  type?: string;
  metadata?: Metadata;
  description?: string;
  tax_amounts?: any[];
  discounts?: any[];
  plan?: Plan | null;
  proration?: boolean;
  amount?: number;
  livemode?: boolean;
  quantity?: number;
  price?: Price;
  subscription_item?: string;
}

export interface Metadata {
  price?: string;
}

export interface Period {
  start?: number;
  end?: number;
}

export interface Plan {
  amount?: number;
  amount_decimal?: string;
  billing_scheme?: string;
  aggregate_usage?: null;
  metadata?: Metadata;
  livemode?: boolean;
  interval?: string;
  tiers?: null;
  currency?: string;
  created?: number;
  product?: string;
  tiers_mode?: null;
  id?: string;
  trial_period_days?: null;
  transform_usage?: null;
  object?: string;
  usage_type?: string;
  interval_count?: number;
  active?: boolean;
  nickname?: null;
}

export interface Price {
  currency?: string;
  type?: string;
  metadata?: Metadata;
  product?: string;
  unit_amount_decimal?: string;
  billing_scheme?: string;
  recurring?: Recurring | null;
  unit_amount?: number;
  created?: number;
  id?: string;
  lookup_key?: null;
  transform_quantity?: null;
  active?: boolean;
  object?: string;
  nickname?: null;
  tiers_mode?: null;
  livemode?: boolean;
}

export interface Recurring {
  interval?: string;
  usage_type?: string;
  aggregate_usage?: null;
  interval_count?: number;
  trial_period_days?: null;
}

export interface PaymentSettings {
  payment_method_types?: null;
  payment_method_options?: null;
}

export interface StatusTransitions {
  paid_at?: number;
  marked_uncollectible_at?: null;
  finalized_at?: number;
  voided_at?: null;
}
