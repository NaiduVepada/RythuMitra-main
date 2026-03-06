import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { BookOpen } from "lucide-react";

type Article = {
  title: string;
  category: string;
  readTime: string;
  image: string;
  content: string;
};

const ARTICLES: Record<string, Article> = {
  "sustainable-farming-practices-for-better-yields": {
    title: "Sustainable Farming Practices for Better Yields",
    category: "Crop Management",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
    content: `
      Sustainable farming is essential for protecting our environment while providing enough food for a growing population. Key practices include:

      1. Crop Rotation: Changing the type of crop grown in a field each season or year to reduce soil erosion, build soil fertility and increase crop yield.
      2. Cover Crops: Planting crops like clover or rye in the off-season to protect the soil from erosion and add organic matter.
      3. Integrated Pest Management (IPM): Using biological controls like natural predators, trap crops, and resistant varieties to manage pests, reducing reliance on chemical pesticides.
      4. Conservation Tillage: Minimizing soil disturbance by reducing tilling, which helps preserve soil structure and retain moisture.
      
      By adopting these practices, farmers can maintain healthy soil ecosystems, increase resilience against climate change, and achieve sustainable, high-quality yields.
    `,
  },
  "natural-pest-control-methods": {
    title: "Natural Pest Control Methods",
    category: "Pest Control",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200",
    content: `
      Natural pest control is an environmentally friendly alternative to chemical pesticides. It focuses on maintaining a balanced ecosystem where natural predators keep pests in check.

      Methods include:
      - Biological Control: Introducing beneficial insects like ladybugs to eat aphids, or parasitic wasps to control caterpillars.
      - Trap Cropping: Planting specific crops that attract pests away from the main valuable crop.
      - Companion Planting: Grouping certain plants together that naturally repel pests or attract beneficial insects (e.g., planting marigolds near tomatoes).
      - Neem Oil & Natural Sprays: Using plant-based oils and sprays that disrupt the life cycle of pests without harming the environment or beneficial insects.

      Reducing chemical pesticide use not only protects the environment but also leads to healthier crops and safer food for consumers.
    `,
  },
  "improving-soil-fertility-organically": {
    title: "Improving Soil Fertility Organically",
    category: "Soil Care",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200",
    content: `
      Healthy soil is the foundation of organic farming. Improving soil fertility organically means feeding the soil biology, which in turn feeds the plants.

      Key Strategies:
      - Composting: Adding decomposed organic matter to the soil to improve its structure, water-holding capacity, and nutrient content.
      - Manure and Animal Byproducts: Using well-rotted animal manure (like cow or chicken manure), bone meal, or blood meal to provide essential nutrients like nitrogen, phosphorus, and potassium.
      - Green Manures: Growing specific cover crops (like legumes) and plowing them back into the soil to add organic matter and fix nitrogen from the air.
      - Minimizing Compaction: Avoiding heavy machinery on wet soil to maintain good soil structure and aeration for root growth.
    `,
  },
  "water-conservation-techniques": {
    title: "Water Conservation Techniques",
    category: "Irrigation",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200",
    content: `
      Water is a precious resource in agriculture. Conservation techniques are essential for sustainable farming, especially in arid regions.

      Effective Techniques:
      - Drip Irrigation: Delivering water directly to the plant's roots through a network of tubes and emitters, reducing evaporation and runoff.
      - Mulching: Applying an organic layer (like straw or wood chips) to the soil surface to retain moisture, suppress weeds, and regulate soil temperature.
      - Rainwater Harvesting: Collecting and storing rainwater for later use in irrigation during dry periods.
      - Drought-Resistant Crops: Selecting crop varieties that require less water and are better adapted to local climates.
    `,
  },
  "transition-to-modern-farming": {
    title: "Transition to Modern Farming",
    category: "Modern Farming",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200",
    content: `
      Modern farming integrates advanced technologies and data-driven approaches to optimize agricultural production.

      Technological Advancements:
      - Precision Agriculture: Using GPS and sensors to map fields, analyze soil variability, and apply inputs (water, fertilizer, pesticides) exactly where needed.
      - Drones and Aerial Imaging: Monitoring crop health, identifying pest infestations, and assessing field conditions from above to make timely management decisions.
      - Smart Sensors: Deploying sensors in the soil to measure moisture, temperature, and nutrient levels in real-time.
      - Farm Management Software: Utilizing digital platforms to track operations, analyze data, and improve decision-making processes.

      The transition to modern farming helps increase efficiency, reduce resource waste, and boost overall farm profitability.
    `,
  },
  "understanding-market-prices": {
    title: "Understanding Market Prices",
    category: "Market Trends",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200",
    content: `
      Market prices for agricultural commodities are dynamic and influenced by various factors. Understanding these trends is crucial for farm financial planning.

      Factors Influencing Prices:
      - Supply and Demand: High supply with low demand typically lowers prices, while low supply with high demand drives prices up.
      - Weather and Climate: Extreme weather events (droughts, floods) can impact crop yields globally, directly affecting market supply and prices.
      - Government Policies: Subsidies, trade tariffs, and import/export regulations play a significant role in shaping market dynamics.
      - Global Economic Conditions: Economic growth, inflation, and currency exchange rates can influence domestic and international market demand.

      By staying informed about these factors, farmers can make strategic decisions on when to sell their produce for the best return.
    `,
  }
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const article = ARTICLES[slug];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title={article?.title || "Article"} description="Knowledge Hub" icon={BookOpen} />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {article ? (
            <Card>
              <div className="relative h-64">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{article.readTime} • {article.category}</p>
                <p>{article.content}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <p>Article not found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
