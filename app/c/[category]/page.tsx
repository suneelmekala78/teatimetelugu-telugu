import TabTitle from "@/components/common/titles/TabTitle";
import CategoryPosts from "./CategoryPosts";
import CategoryTabs from "@/components/category/categorytabs/CategoryTabs";

const titleMap: Record<string, string> = {
  movies: "సినిమా వార్తలు",
  news: "సామాన్య వార్తలు",
  politics: "రాజకీయ వార్తలు",
  gossips: "గాసిప్స్",
  ott: "ఓటీటీ వార్తలు",
  gallery: "గ్యాలరీ",
  videos: "వీడియోలు",
  reviews: "సినిమా రివ్యూస్",
  sports: "క్రీడలు",
  technology: "టెక్నాలజీ",
  business: "బిజినెస్ వార్తలు",
  health: "ఆరోగ్యం",
};

//
// ✅ NEW: await params here too
//
export async function generateMetadata({ params }: any) {
  const { category } = await params;

  return {
    title: titleMap[category] || `${category}`,
  };
}

//
// ✅ VERY IMPORTANT → async + await
//
export default async function Page({ params, searchParams }: any) {
  const { category } = await params;
  const query = await searchParams;

  return (
    <main className="category-page">
      <TabTitle title={titleMap[category] || category} />

      <CategoryTabs />

      <CategoryPosts
        category={category}
        subcategory={query.subcategory}
        page={Number(query.page) || 1}
      />
    </main>
  );
}
