export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface NavDropdownGroup {
  label: string;
  links: NavLink[];
}

export interface SolutionItem {
  number: string;
  name: string;
  description: string;
  link: string;
  logo?: string;
}

export interface EcosystemProduct {
  id: string;
  name: string;
  description: string;
  logo: string;
  link: string;
  category: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  priceUnit?: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
}

export interface AwardItem {
  text: string;
  logo?: string;
}

export interface MediaCard {
  title: string;
  date: string;
  image?: string;
  link: string;
  category?: string;
}

export interface TokenStat {
  label: string;
  value: string;
}
