export interface ITaste {
  name: string;
  price: number | { value: string };
  features: Array<{
    label: string;
    icon: string;
  }>;
}
