import Image from "@/components/image";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import { works } from "./data";

export default function Portfolio() {
  return (
    <main className="grid grid-cols-1 font-sans font-light lg:place-items-center">
      <section className="grid grid-cols-1 lg:max-w-2xl lg:border-x-[0.9px] lg:border-stone-700">
        {works.map((item, index) => (
          <div key={index} className="flex flex-col">
            <Link
              href={item.link}
              className="flex flex-col p-4 gap-4 active:bg-accent"
            >
              <Image
                src={item.thumbnail}
                alt={`Preview of project ${item.title}`}
              />
              <p className="text-lg font-normal">{item.title}</p>
              <p>{item.description}</p>
              <div className="flex flex-row justify-between text-neutral-300">
                <p className="flex flex-row gap-2 flex-wrap">
                  {item.topics.map((topic, index) => (
                    <Fragment key={index}>
                      <span>{topic}</span>
                      {index < item.topics.length - 1 && <>&middot;</>}
                    </Fragment>
                  ))}
                </p>

                {item.pubdate && (
                  <p>{format(parseISO(item.pubdate), "MMM d")}</p>
                )}
              </div>
            </Link>

            {index < works.length - 1 && (
              <div className="h-[0.9px] w-full bg-stone-700" />
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
