export interface IndustryCard {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface AdvantageFeature {
  icon: React.ReactNode;
  label: string;
  description: string;
}

export interface HowItWorksStep {
  number: string;
  tag: string;
  title: string;
  description: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface SellPoint {
  title: string;
  description: string;
}
