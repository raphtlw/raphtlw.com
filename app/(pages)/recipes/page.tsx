import { SpatialMaterial } from "@/components/spatial/material";
import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_ALL_RECIPES } from "@/sanity/lib/queries";
import { format } from "date-fns";
import Link from "next/link";

export default async function Page() {
  const { data: recipes } = await sanityFetch({
    query: QUERY_ALL_RECIPES,
  });

  return (
    <main className="py-16">
      <div className="px-10 md:max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Recipes</h1>

        <div className="grid grid-cols-2 mt-10">
          {recipes.map((recipe) => (
            <Link href={`/recipes/${recipe.slug}`} key={recipe.slug}>
              <SpatialMaterial
                className="flex flex-col gap-y-1 px-4 py-2 rounded-xl bg-slate-400 bg-opacity-10 backdrop-filter backdrop-blur-2xl"
                enableTap
              >
                <p className="text-neutral-200 font-semibold font-mono pt-2">
                  {`<`}
                  {recipe.title}
                  {` />`}
                </p>
                {recipe.previewUrl ? (
                  <video
                    src={recipe.previewUrl}
                    autoPlay
                    playsInline
                    loop
                    muted
                    preload="auto"
                    className="rounded-lg overflow-hidden pointer-events-none"
                  ></video>
                ) : (
                  <p className="text-neutral-300">No preview available</p>
                )}
                <p className="text-neutral-600 dark:text-neutral-400 tabular-nums">
                  {format(new Date(recipe.publishedAt), "MMMM dd, yyyy")}
                </p>
              </SpatialMaterial>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
