import { cn } from "@/lib/utils";
import * as motion from "motion/react-client";
import Link from "next/link";

const MotionLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <motion.p
    initial={{
      opacity: 1,
      filter: "brightness(1)",
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    }}
    whileTap={{
      opacity: 0.4,
      filter: "brightness(1.2)",
      transition: { duration: 0.02, ease: "linear" },
    }}
  >
    <Link href={href}>{children}</Link>
  </motion.p>
);

const SectionHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: React.ComponentProps<"p">["className"];
}) => (
  <p
    className={cn(
      "uppercase text-xs font-medium text-cv-accent-primary",
      className,
    )}
  >
    {children}
  </p>
);

export default function CV() {
  return (
    <article className="grid grid-cols-1 px-8 py-10">
      <h1 className="text-2xl font-bold">Raphael Tang</h1>
      <p className="text-sm">Singapore</p>

      <div className="grid grid-cols-1 mt-6 gap-4">
        <SectionHeader>Contact Information</SectionHeader>

        <div className="grid grid-cols-1">
          <MotionLink href="https://t.me/raphtlw">
            @raphtlw (Telegram)
          </MotionLink>
          <MotionLink href="mailto:raphpb1912@gmail.com">
            raphpb1912@gmail.com (Email)
          </MotionLink>
          <MotionLink href="https://raphtlw.com">
            https://raphtlw.com (Web)
          </MotionLink>
          <MotionLink href="https://www.linkedin.com/in/raphtlw">
            linkedin.com/in/raphtlw (LinkedIn)
          </MotionLink>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-6 gap-4">
        <SectionHeader>Experience</SectionHeader>

        <div className="grid grid-cols-1">
          <p className="font-semibold">Data Visualization Developer</p>
          <p className="text-sm">The Straits Times</p>
          <p className="text-xs text-gray-500">
            Sep 2025 – Feb 2026 · Singapore
          </p>
          <p className="text-sm mt-1">
            Worked with Rodolfo Pazos and his award-winning team of journalists,
            designers and developers to produce data-driven, insightful and
            informative stories resonating with audiences globally.
          </p>
        </div>

        <div className="grid grid-cols-1">
          <p className="font-semibold">Apprentice</p>
          <p className="text-sm">Global Finance & Technology Network (GFTN)</p>
          <p className="text-xs text-gray-500">
            Aug 2025 – Nov 2025 · Singapore
          </p>
          <p className="text-sm mt-1">
            Connected with frontier leaders in the blockchain and Web3 space, to
            see what they&apos;re building, and why it matters.
          </p>
        </div>

        <div className="grid grid-cols-1">
          <p className="font-semibold">Coding & Robotics Instructor</p>
          <p className="text-sm">Futurum Academy Singapore</p>
          <p className="text-xs text-gray-500">
            Oct 2024 – Apr 2025 · Singapore
          </p>
          <p className="text-sm mt-1">
            Built future engineers from the ground up. Designed robotics +
            coding curricula (VEX, Scratch), created scalable Notion-based
            lesson systems, and managed back-to-back teaching sprints — all
            while keeping students curious.
          </p>
        </div>

        <div className="grid grid-cols-1">
          <p className="font-semibold">Engineer / Product Developer</p>
          <p className="text-sm">NOK Asia Company Pte. Ltd</p>
          <p className="text-xs text-gray-500">
            Dec 2022 – Apr 2023 · Singapore
          </p>
          <p className="text-sm mt-1">
            Led the build of an internal HR app serving 4 companies, integrated
            legacy ASP.NET Core (SOAP) systems via custom Express REST APIs, and
            replaced paper-dependent systems with a clean React Native stack.
            Brought design, code, and users into one tight loop.
          </p>
        </div>

        <div className="grid grid-cols-1">
          <p className="font-semibold">System Engineering Intern</p>
          <p className="text-sm">NOK Asia Company Pte. Ltd</p>
          <p className="text-xs text-gray-500">
            Mar 2022 – Jun 2022 · Singapore
          </p>
          <p className="text-sm mt-1">
            Automated cafeteria queues (QR-based meal system), digitized vendor
            logs (visitor management system), and reduced database retrieval
            times by 10%.
          </p>
        </div>

        <div className="grid grid-cols-1">
          <p className="font-semibold">Freelance Dev (Product + Frontend)</p>
          <p className="text-sm">Fiverr</p>
          <p className="text-xs text-gray-500">
            Jan 2021 – Jan 2022 · Singapore
          </p>
          <p className="text-sm mt-1">
            Worked with global clients to design + deploy small apps with real
            impact. Migrated sites (e.g., Svelte to Next.js), improved code
            performance by 20%, and became the go-to for debugging on deadline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-6 gap-4">
        <SectionHeader>Education</SectionHeader>

        <div>
          <p className="font-semibold">Temasek Polytechnic</p>
          <p className="text-sm">
            Associate&apos;s Degree, Information Technology
          </p>
          <p className="text-xs text-gray-500">Apr 2023 – Apr 2026</p>
        </div>

        <div>
          <p className="font-semibold">Institute of Technical Education</p>
          <p className="text-sm">
            Diploma of Education, Information Technology
          </p>
          <p className="text-xs text-gray-500">Jan 2021 – Jan 2023</p>
        </div>

        <div>
          <p className="font-semibold">Anglo-Chinese School (Barker Road)</p>
          <p className="text-sm">GCE N(A)-Level</p>
          <p className="text-xs text-gray-500">Jan 2017 – Jan 2021</p>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-6 gap-4">
        <SectionHeader>Top Skills</SectionHeader>
        <ul className="grid grid-cols-1 gap-1">
          <li className="text-sm">Data Visualization</li>
          <li className="text-sm">Technical Writing</li>
          <li className="text-sm">Quantitative Research</li>
          <li className="text-sm">Visual Communications</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 mt-6 gap-4">
        <SectionHeader>Languages</SectionHeader>
        <ul className="grid grid-cols-1 gap-1">
          <li className="text-sm">English (Native or Bilingual)</li>
          <li className="text-sm">Chinese (Full Professional)</li>
          <li className="text-sm">Korean (Elementary)</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 mt-6 gap-4">
        <SectionHeader>Certifications</SectionHeader>
        <ul className="grid grid-cols-1 gap-1">
          <li className="text-sm">
            Basic Proficiency in KNIME Analytics Platform
          </li>
          <li className="text-sm">Windows 11: Security</li>
          <li className="text-sm">Food Safety and Hygiene Level 1</li>
        </ul>
      </div>
    </article>
  );
}
