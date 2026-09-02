export interface AnimalDrop {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  philosophy: string;
  mantra: string;
  status: 'AVAILABLE' | 'COMING SOON';
  mindset: string;
  traits: string[];
  image?: string;
  isHero?: boolean;
}

export interface ProductDetails {
  brand: string;
  campaign: string;
  dropNumber: string;
  dropName: string;
  productName: string;
  editionTotal: number;
  price: string;
  currency: string;
  color: string;
  colorCode: string;
  fit: string;
  fabric: string;
  gsm: string;
  features: string[];
  manifestoPrimary: string;
  manifestoSecondary: string;
  storyChapters: {
    number: string;
    title: string;
    subtitle: string;
    text: string;
    image: string;
  }[];
}

export const PRODUCT_DATA: ProductDetails = {
  brand: "DRIP COSMOS",
  campaign: "ANIMAL KINGDOM",
  dropNumber: "01",
  dropName: "EAGLE",
  productName: "DROP 01: EAGLE OVERSIZED HEAVYWEIGHT TEE",
  editionTotal: 500,
  price: "185",
  currency: "USD",
  color: "Off-White / Vintage Cream",
  colorCode: "#F1EFE8",
  fit: "Luxury Boxy Oversized Silhouette",
  fabric: "100% Organic Heavyweight Combed Cotton",
  gsm: "280 GSM Luxury Weave",
  features: [
    "High-density screenprint front 'DRIP COSMOS' arch",
    "Masterwork 'EAGLE / VISION / MANIFESTED NOT MANUFACTURED' back mural",
    "Hand-numbered authentic woven hem label with holographic seal",
    "Custom reinforced ribbed collar & drop shoulder construction",
    "Collector packaging including rigid magnetic display box, patterned tissue, & story art cards"
  ],
  manifestoPrimary: "YOU DON'T FOLLOW TRENDS. YOU SET YOUR ORBIT.",
  manifestoSecondary: "MANIFESTED NOT MANUFACTURED.",
  storyChapters: [
    {
      number: "01",
      title: "THE CALLING",
      subtitle: "Vision Begins",
      text: "Before greatness is earned, before legends are written, there is a moment that changes everything. A silent calling awakens those destined for more. It is not heard by everyone; only those with true vision recognize it.",
      image: "/textures/story_the_calling.png"
    },
    {
      number: "02",
      title: "THE VISION",
      subtitle: "The Symbol Awakens",
      text: "Not every soul is meant to carry vision. It chooses those who refuse to settle for ordinary, those who remain unshaken when the world demands conformity. The symbol awakens: destiny is no longer imagined. It is worn, lived, and embodied.",
      image: "/textures/story_the_vision.png"
    },
    {
      number: "03",
      title: "THE CHOSEN ONE",
      subtitle: "Vision Finds Its Bearer",
      text: "The sacred emblem finds its bearer. In a realm of noise and fleeting trends, the bearer stands grounded, looking beyond the horizon to the higher skies.",
      image: "/textures/story_the_chosen_one.png"
    },
    {
      number: "04",
      title: "THE RISE",
      subtitle: "Eagle Takes Flight",
      text: "The time for waiting has passed. Guided by vision and strengthened by purpose, the eagle rises without hesitation. It does not seek permission, nor does it fear the unknown. Every beat of its wings is a declaration of courage, freedom, and relentless ambition.",
      image: "/textures/story_the_rise.png"
    }
  ]
};

export const ANIMAL_KINGDOM_DROPS: AnimalDrop[] = [
  {
    id: "01",
    number: "01",
    name: "EAGLE",
    subtitle: "VISION BEYOND LIMITS",
    philosophy: "The Eagle doesn't follow the wind. It uses it.",
    mantra: "See what others can't. Achieve what others won't.",
    status: "AVAILABLE",
    mindset: "Vision • Freedom • Higher Perspective",
    traits: ["Vision Beyond Limits", "Ascension Over Doubt", "Unbound Trajectory"],
    image: "/textures/file_0000000051ac7207b1f2827e239ab5e8.png",
    isHero: true
  },
  {
    id: "02",
    number: "02",
    name: "LION",
    subtitle: "THE KING WITHIN",
    philosophy: "The world follows those who lead themselves first.",
    mantra: "Leadership • Courage • Self-Mastery",
    status: "COMING SOON",
    mindset: "Leadership • Courage • Sovereign Rule",
    traits: ["Inner Sovereignty", "Unshakable Courage", "Commanding Presence"]
  },
  {
    id: "03",
    number: "03",
    name: "TIGER",
    subtitle: "THE FEARLESS WARRIOR",
    philosophy: "Discipline today, dominance tomorrow.",
    mantra: "Power • Discipline • Determination",
    status: "COMING SOON",
    mindset: "Power • Relentless Focus • Dominance",
    traits: ["Predatory Precision", "Fierce Tenacity", "Unrelenting Drive"]
  },
  {
    id: "04",
    number: "04",
    name: "WOLF",
    subtitle: "THE LONE PACK",
    philosophy: "Built alone. Never lonely.",
    mantra: "Loyalty • Resilience • Independence",
    status: "COMING SOON",
    mindset: "Loyalty • Instinct • Resilience",
    traits: ["Instinctive Intelligence", "Pack Loyalty", "Unyielding Endurance"]
  },
  {
    id: "05",
    number: "05",
    name: "OWL",
    subtitle: "THE SILENT WATCHER",
    philosophy: "Watch. Learn. Adapt. Then act.",
    mantra: "Wisdom • Intuition • Observation",
    status: "COMING SOON",
    mindset: "Wisdom • Nocturnal Sight • Intuition",
    traits: ["Silent Calculus", "Omniscient Insight", "Patience"]
  },
  {
    id: "06",
    number: "06",
    name: "ELEPHANT",
    subtitle: "THE WISE BUILDER",
    philosophy: "Build. Protect. Remain humble.",
    mantra: "Strength • Wisdom • Loyalty",
    status: "COMING SOON",
    mindset: "Strength • Ancient Memory • Legacy",
    traits: ["Monumental Foundation", "Generational Wisdom", "Gentle Power"]
  }
];
