export interface ComponentItem {
  componentType: string;
  data: any;
}

export interface ICard {
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface ILatestNews {
  date: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface ITour {
  id: number;
  tags: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  detailImage: string;
  detailTags: string;
  description: string;
  tourSteps: ITourStep[];
}

export interface IPlace {
  id: number;
  tags: string[];
  title: string;
  description: string;
  distance: string;
  image: string;
  href: string;
}

export interface IWhatsOn {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface IGettingHere {
  id: number;
  icon: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export interface IFaq {
  question: string;
  answer: string;
}

export interface ILatLong {
  lat: number;
  lng: number;
}

export interface ITourStep {
  id: number,
  step: number,
  location: ILatLong
  title: string;
  image: number;
  beforeArrival: string;
  whenArrived: string;
  arLink: string;
  audioLink: string;
  content: string;
}