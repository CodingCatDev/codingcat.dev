export interface Subscription {
  id: string;
  current_period_start: CurrentPeriodStart;
  prices: Price[];
  trial_end: any;
  quantity: number;
  product: Product;
  canceled_at?: CanceledAt;
  stripeLink: string;
  current_period_end: CurrentPeriodEnd;
  price: Price2;
  cancel_at: any;
  ended_at?: EndedAt;
  trial_start: any;
  items: Item[];
  created: Created;
  role: string;
  cancel_at_period_end: boolean;
  metadata: Metadata5;
  status: string;
}

export interface CurrentPeriodStart {
  seconds: number;
  nanoseconds: number;
}

export interface Price {
  converter: any;
  _key: Key;
  type: string;
  firestore: Firestore;
}

export interface Key {
  path: Path;
}

export interface Path {
  segments: string[];
  offset: number;
  len: number;
}

export interface Firestore {
  app: App;
  databaseId: DatabaseId;
  settings: Settings;
}

export interface App {
  _isDeleted: boolean;
  _options: Options;
  _config: Config;
  _name: string;
  _automaticDataCollectionEnabled: boolean;
  _container: Container;
}

export interface Options {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface Config {
  name: string;
  automaticDataCollectionEnabled: boolean;
}

export interface Container {
  name: string;
  providers: Providers;
}

export interface Providers {}

export interface DatabaseId {
  projectId: string;
  database: string;
}

export interface Settings {
  host: string;
  ssl: boolean;
  ignoreUndefinedProperties: boolean;
  cacheSizeBytes: number;
  experimentalForceLongPolling: boolean;
  experimentalAutoDetectLongPolling: boolean;
  experimentalLongPollingOptions: ExperimentalLongPollingOptions;
  useFetchStreams: boolean;
}

export interface ExperimentalLongPollingOptions {}

export interface Product {
  converter: any;
  _key: Key2;
  type: string;
  firestore: Firestore2;
}

export interface Key2 {
  path: Path2;
}

export interface Path2 {
  segments: string[];
  offset: number;
  len: number;
}

export interface Firestore2 {
  app: App2;
  databaseId: DatabaseId2;
  settings: Settings2;
}

export interface App2 {
  _isDeleted: boolean;
  _options: Options2;
  _config: Config2;
  _name: string;
  _automaticDataCollectionEnabled: boolean;
  _container: Container2;
}

export interface Options2 {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface Config2 {
  name: string;
  automaticDataCollectionEnabled: boolean;
}

export interface Container2 {
  name: string;
  providers: Providers2;
}

export interface Providers2 {}

export interface DatabaseId2 {
  projectId: string;
  database: string;
}

export interface Settings2 {
  host: string;
  ssl: boolean;
  ignoreUndefinedProperties: boolean;
  cacheSizeBytes: number;
  experimentalForceLongPolling: boolean;
  experimentalAutoDetectLongPolling: boolean;
  experimentalLongPollingOptions: ExperimentalLongPollingOptions2;
  useFetchStreams: boolean;
}

export interface ExperimentalLongPollingOptions2 {}

export interface CanceledAt {
  seconds: number;
  nanoseconds: number;
}

export interface CurrentPeriodEnd {
  seconds: number;
  nanoseconds: number;
}

export interface Price2 {
  converter: any;
  _key: Key3;
  type: string;
  firestore: Firestore3;
}

export interface Key3 {
  path: Path3;
}

export interface Path3 {
  segments: string[];
  offset: number;
  len: number;
}

export interface Firestore3 {
  app: App3;
  databaseId: DatabaseId3;
  settings: Settings3;
}

export interface App3 {
  _isDeleted: boolean;
  _options: Options3;
  _config: Config3;
  _name: string;
  _automaticDataCollectionEnabled: boolean;
  _container: Container3;
}

export interface Options3 {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface Config3 {
  name: string;
  automaticDataCollectionEnabled: boolean;
}

export interface Container3 {
  name: string;
  providers: Providers3;
}

export interface Providers3 {}

export interface DatabaseId3 {
  projectId: string;
  database: string;
}

export interface Settings3 {
  host: string;
  ssl: boolean;
  ignoreUndefinedProperties: boolean;
  cacheSizeBytes: number;
  experimentalForceLongPolling: boolean;
  experimentalAutoDetectLongPolling: boolean;
  experimentalLongPollingOptions: ExperimentalLongPollingOptions3;
  useFetchStreams: boolean;
}

export interface ExperimentalLongPollingOptions3 {}

export interface EndedAt {
  seconds: number;
  nanoseconds: number;
}

export interface Item {
  price: Price3;
  plan: Plan;
  subscription: string;
  tax_rates: any[];
  quantity: number;
  id: string;
  billing_thresholds: any;
  created: number;
  object: string;
  metadata: Metadata4;
  discounts: any[];
}

export interface Price3 {
  currency: string;
  unit_amount_decimal: string;
  id: string;
  metadata: Metadata;
  lookup_key: any;
  transform_quantity: any;
  created: number;
  custom_unit_amount: any;
  type: string;
  product: Product2;
  active: boolean;
  unit_amount: number;
  billing_scheme: string;
  object: string;
  nickname: string;
  tax_behavior: string;
  tiers_mode: any;
  livemode: boolean;
  recurring: Recurring;
}

export interface Metadata {}

export interface Product2 {
  features: any[];
  package_dimensions: any;
  description: string;
  name: string;
  url: any;
  unit_label: any;
  type: string;
  livemode: boolean;
  id: string;
  images: string[];
  attributes: any[];
  object: string;
  shippable: any;
  default_price: any;
  metadata: Metadata2;
  active: boolean;
  statement_descriptor: any;
  tax_code: any;
  marketing_features: any[];
  created: number;
  updated: number;
}

export interface Metadata2 {
  firebaseRole: string;
}

export interface Recurring {
  aggregate_usage: any;
  interval_count: number;
  trial_period_days: any;
  usage_type: string;
  meter: any;
  interval: string;
}

export interface Plan {
  product: string;
  tiers_mode: any;
  amount_decimal: string;
  trial_period_days: any;
  meter: any;
  id: string;
  object: string;
  interval_count: number;
  usage_type: string;
  created: number;
  currency: string;
  active: boolean;
  amount: number;
  metadata: Metadata3;
  aggregate_usage: any;
  interval: string;
  billing_scheme: string;
  nickname: string;
  livemode: boolean;
  transform_usage: any;
}

export interface Metadata3 {}

export interface Metadata4 {}

export interface Created {
  seconds: number;
  nanoseconds: number;
}

export interface Metadata5 {}
