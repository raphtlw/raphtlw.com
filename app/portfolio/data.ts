export type Work = {
  title: string;
  description: string;
  organization: string;
  thumbnail: string;
  link: string;
  topics: string[];
  pubdate: string;
};

export const works: Work[] = [
  {
    title: "The thrill lasts seconds, the trash lasts forever.",
    description:
      "Blind boxes are a billion-dollar business with a waste problem no one is talking about.",
    organization: "The Straits Times",
    thumbnail: "06fd8558fe2726bdadb5d3307dd394e26b17e29c.jpg",
    link: "https://www.straitstimes.com/multimedia/graphics/2026/03/blind-boxes/index.html",
    topics: ["Video Analysis", "Emotion Capture", "Writing"],
    pubdate: "2026-03-12",
  },

  {
    title: "How has your home changed over the years? — Print",
    description:
      "Singapore’s landscape is constantly evolving. Here are some changes to come.",
    organization: "The Straits Times",
    thumbnail: "photos/thumbnail-how-has-your-home-changed-over-the-years.jpg",
    link: "https://www.straitstimes.com/multimedia/graphics/2025/12/2025-masterplan-redevelopment/index.html",
    topics: ["Graphics", "ArcGIS", "GeoJSON"],
    pubdate: "2025-12-21",
  },

  {
    title:
      "Find out what's changed in urban developments in Singapore, and what's to come.",
    description:
      "Singapore’s landscape is constantly evolving. Here are some changes to come.",
    organization: "The Straits Times",
    thumbnail: "photos/thumbnail-singapore-redevelopment-masterplan.jpg",
    link: "https://www.straitstimes.com/multimedia/graphics/2025/12/2025-masterplan-redevelopment/index.html",
    topics: ["Graphics", "Mapbox", "Turf.js"],
    pubdate: "2025-12-21",
  },

  {
    title: "World Cup 2026 — Calendar",
    description: "Keep up and keep score for every match at the 2026 World Cup",
    organization: "The Straits Times",
    thumbnail: "photos/thumbnail-worldcup-2026-fixtures.jpg",
    link: "https://www.straitstimes.com/multimedia/graphics/2025/12/worldcup-2026-fixtures/index.html",
    topics: ["UI/UX", "Interaction Design"],
    pubdate: "2025-12-06",
  },

  {
    title: "2025 in visual stories and digital graphics",
    description:
      "An collection of all the digital graphics from The Straits Times",
    organization: "The Straits Times",
    thumbnail: "photos/thumbnail-visual-stories-and-digital-graphics-2025.jpg",
    link: "https://www.straitstimes.com/multimedia/graphics/2025/12/visual-stories-and-digital-graphics-2025/index.html",
    topics: ["MicroCMS", "Data Pipeline"],
    pubdate: "2025-12-29",
  },

  {
    title: "Singapore Stock Market Quiz",
    description: "An interactive using the quiz format",
    organization: "The Straits Times",
    thumbnail: "photos/thumbnail-stock-mkt-quiz-facebook.jpg",
    link: "https://www.straitstimes.com/multimedia/graphics/2025/11/singapore-st-stock-market-quiz/index.html",
    topics: ["ArchieML", "Trivia", "Finance", "Investing"],
    pubdate: "2025-11-29",
  },

  {
    title: "raphGPT",
    description:
      "OpenAI o4-mini based Telegram bot which uses Vercel's AI SDK for superior tool calling capabilities and state management.",
    organization: "Side Projects",
    thumbnail: "6bada53d3fd49b2abd7ae81f4f89faf3d81a2251.png",
    link: "https://t.me/raphgptbot",
    topics: ["Telegram API", "Multi-Agent system"],
    pubdate: "2025-01-01",
  },

  {
    title: "1Solar Website",
    description:
      "Developed and SEO optimized a Wordpress website for 1Solar, giving them a unique and targeted web presence.",
    organization: "1Solar Pte Ltd",
    thumbnail: "photos/thumbnail-1solar-sg-website.png",
    link: "https://1solar.sg",
    topics: ["PV Systems", "Wordpress", "WhatsApp"],
    pubdate: "2025-02-01",
  },

  {
    title: "NOK SG App",
    description:
      "Expo React Native app for Digital Transformation in the Company, replacing paper-intensive workloads with mini-apps",
    organization: "NOK Asia Company Pte. Ltd",
    thumbnail: "00ee59573bc56793d5dff32dfe5f3d21c2892fe3.png",
    link: "https://play.google.com/store/apps/details?id=sg.com.nok&hl=en_US",
    topics: ["Enterprise Apps", "ASP.NET"],
    pubdate: "2023-03-16",
  },

  {
    title: "CoronaStats",
    description:
      "Covid-19 Dashboard, developed when learning React.js. Surprisingly still works today.",
    organization: "Side Projects",
    thumbnail: "a9a7592e1bcd0c5e9087c1938609ddfd841fbcc2.png",
    link: "https://coronastats.vercel.app",
    topics: ["COVID-19", "Statistics", "Data"],
    pubdate: "2020-06-04",
  },
];
