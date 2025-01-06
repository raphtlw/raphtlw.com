import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-[#e6f7e6]">
        <Link className="flex items-center justify-center" href="/">
          <span className="text-2xl font-bold text-[#111827]">raphGPT</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-[#111827] hover:underline underline-offset-4"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium text-[#111827] hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-[#111827] hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#e6f7e6] to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter text-[#111827] sm:text-4xl md:text-5xl lg:text-6xl text-center mb-8">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-[#4b5563] text-center mb-12">
              Start chatting with $1.69 in free credits. Pay only for what you
              use beyond that.
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
              <PricingCard
                title="Free Starter"
                description="Perfect for trying out raphGPT"
                price="$0"
                features={[
                  "$1.69 in free credits",
                  "Access to all features",
                  "No commitment required",
                ]}
                ctaText="Start Chatting"
                ctaLink="https://t.me/raphgptbot"
              />
              <PricingCard
                title="Pay As You Go"
                description="For regular users"
                price="Varies"
                features={[
                  "OpenAI token pricing",
                  "+$0.10 per message",
                  "Flexible usage",
                  "Multiple payment options",
                ]}
                ctaText="Top Up Credits"
                ctaLink="#"
                highlighted={true}
              />
              <PricingCard
                title="Enterprise"
                description="For high-volume users"
                price="Custom"
                features={[
                  "Volume discounts",
                  "Dedicated support",
                  "Custom integrations",
                  "Preferred payment methods",
                ]}
                ctaText="Contact Sales"
                ctaLink="#"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-[#111827] sm:text-4xl md:text-5xl text-center mb-8">
              Detailed Pricing Breakdown
            </h2>
            <div className="max-w-3xl mx-auto bg-[#f0fdf4] rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-[#111827] mb-4">
                Token Pricing
              </h3>
              <p className="text-[#4b5563] mb-4">
                We use OpenAI&apos;s token pricing structure, with an additional
                $0.10 charge per message to support the project.
              </p>
              <table className="w-full text-[#4b5563]">
                <thead>
                  <tr className="border-b border-[#bbf7d0]">
                    <th className="text-left py-2">Model</th>
                    <th className="text-right py-2">Price per 1K tokens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#bbf7d0]">
                    <td className="py-2">GPT-3.5-turbo</td>
                    <td className="text-right">$0.002</td>
                  </tr>
                  <tr>
                    <td className="py-2">GPT-4</td>
                    <td className="text-right">$0.06</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[#4b5563] mt-4">
                Remember, there&apos;s an additional $0.10 charge per message to
                support the project.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f0fdf4]">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-[#111827] sm:text-4xl md:text-5xl text-center mb-8">
              Payment Options
            </h2>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              <PaymentOption
                icon={<Wallet className="h-12 w-12 text-[#22c55e]" />}
                title="Solana"
                description="Pay with Solana for the lowest fees. Only blockchain fees apply (typically less than $0.05)."
                benefits={[
                  "No additional transaction fees",
                  "Fast transactions",
                  "Secure and decentralized",
                ]}
              />
              <PaymentOption
                icon={<CreditCard className="h-12 w-12 text-[#22c55e]" />}
                title="Apple Pay / Google Pay"
                description="Convenient payment through Telegram's built-in provider."
                benefits={[
                  "Easy and familiar checkout process",
                  "Secure payments",
                  "Instant credit top-up",
                ]}
                additionalInfo="3.4% + $0.50 fee per transaction"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full shrink-0 bg-[#e6f7e6]">
        <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-[#4b5563]">
            © 2024 raphGPT. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link
              className="text-xs text-[#4b5563] hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs text-[#4b5563] hover:underline underline-offset-4"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({
  title,
  description,
  price,
  features,
  ctaText,
  ctaLink,
  highlighted = false,
}) {
  return (
    <div
      className={`flex flex-col p-6 bg-white rounded-lg shadow-sm ${highlighted ? "ring-2 ring-[#22c55e]" : ""}`}
    >
      <h3 className="text-2xl font-bold text-[#111827]">{title}</h3>
      <p className="text-[#4b5563] mt-2">{description}</p>
      <p className="mt-4 text-4xl font-bold text-[#111827]">{price}</p>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-[#4b5563]">
            <svg
              className="w-4 h-4 mr-2 text-[#22c55e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className={`mt-6 ${
          highlighted
            ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
            : "bg-white text-[#22c55e] border border-[#22c55e] hover:bg-[#f0fdf4]"
        }`}
      >
        <Link href={ctaLink} className="flex items-center justify-center">
          {ctaText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function PaymentOption({
  icon,
  title,
  description,
  benefits,
  additionalInfo,
}: {
  icon: any;
  title: string;
  description: string;
  benefits: string[];
  additionalInfo?: string;
}) {
  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-2xl font-bold text-[#111827] ml-4">{title}</h3>
      </div>
      <p className="text-[#4b5563] mb-4">{description}</p>
      <ul className="space-y-2 mb-4">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-[#4b5563]">
            <svg
              className="w-4 h-4 mr-2 text-[#22c55e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {benefit}
          </li>
        ))}
      </ul>
      {additionalInfo && (
        <p className="text-sm text-[#4b5563] mt-auto">{additionalInfo}</p>
      )}
    </div>
  );
}
