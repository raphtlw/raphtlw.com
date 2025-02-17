import { SpatialMaterial } from "@/components/spatial/material";
import { getAllPosts, getPost } from "@/content";
import { CONTENT_FOLDER, Frontmatter } from "@/content/recipes";
import { format } from "date-fns";
import Link from "next/link";

export default async function Page() {
  const recipePaths = await getAllPosts(CONTENT_FOLDER);
  const recipes = await Promise.all(
    recipePaths.map((recipe) =>
      getPost<Frontmatter>(CONTENT_FOLDER, recipe.slug),
    ),
  );

  return (
    <main className="py-16">
      <div className="px-10 md:max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Recipes</h1>
        <p>Short copy-and-paste code/configuration with instructions</p>

        <div className="grid md:grid-cols-2 mt-6 gap-4">
          {recipes.map((recipe) => (
            <Link href={`/recipes/${recipe.slug}`} key={recipe.slug}>
              <SpatialMaterial
                className="flex flex-col gap-y-1 px-4 py-2 rounded-xl bg-slate-400 bg-opacity-10 backdrop-filter backdrop-blur-2xl"
                enableTap
              >
                <p className="text-neutral-200 font-semibold font-mono pt-2">
                  {`<`}
                  {recipe.frontmatter.title}
                  {` />`}
                </p>
                {recipe.frontmatter.previewUrl ? (
                  <video
                    src={recipe.frontmatter.previewUrl}
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
                  {format(new Date(recipe.metadata.birthtime), "MMMM dd, yyyy")}
                </p>
              </SpatialMaterial>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
