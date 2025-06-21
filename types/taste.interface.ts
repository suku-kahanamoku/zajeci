export interface ITaste {
  name: string;
  price: {
    value: string;
  };
  popular: boolean;
  features: Array<{
    label: string;
    icon: string;
  }>;
}
