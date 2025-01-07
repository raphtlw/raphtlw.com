import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Calculator,
  Cpu,
  Globe,
  Mic,
  Video,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-[#e6f7e6]">
        <Link className="flex items-center justify-center" href="#">
          <Bot className="h-6 w-6 text-[#22c55e]" />
          <span className="ml-2 text-2xl text-[#111827] font-extrabold">
            raphGPT
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-[#111827] hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-[#111827] hover:underline underline-offset-4"
            href="#about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium text-[#111827] hover:underline underline-offset-4"
            href="/raphgpt/pricing"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-[#e6f7e6] to-white">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-[#111827] sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Meet raphGPT: Your Intelligent Telegram Companion
                </h1>
                <p className="mx-auto max-w-[700px] text-[#4b5563] md:text-xl">
                  Harness the power of AI in your Telegram chats. Understand
                  videos, send voice messages, browse the web, and solve complex
                  math problems.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="inline-flex h-9 items-center justify-center rounded-md bg-[#22c55e] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#16a34a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]">
                  <Link
                    href="https://t.me/raphgptbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Start Chatting
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-[#bbf7d0] text-black bg-white hover:bg-black shadow"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-[#dcfce7]"
        >
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-[#111827] sm:text-5xl text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <FeatureCard
                icon={<Video className="h-10 w-10 text-[#22c55e]" />}
                title="Telebubbles Understanding"
                description="Analyze and interpret video data with ease."
              />
              <FeatureCard
                icon={<Mic className="h-10 w-10 text-[#22c55e]" />}
                title="Voice Messaging"
                description="Send and receive voice messages seamlessly."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-[#22c55e]" />}
                title="Web Browsing"
                description="Access and navigate the web directly from your chat."
              />
              <FeatureCard
                icon={<Calculator className="h-10 w-10 text-[#22c55e]" />}
                title="Advanced Math"
                description="Solve complex mathematical problems instantly."
              />
              <FeatureCard
                icon={<Cpu className="h-10 w-10 text-[#22c55e]" />}
                title="AI Agents"
                description="Leverage cutting-edge AI technology for smarter interactions."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#111827] sm:text-5xl">
                  Experience the Future of Telegram
                </h2>
                <p className="max-w-[900px] text-[#4b5563] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already revolutionizing their
                  Telegram experience with raphGPT. Unlock the full potential of
                  AI-powered communication today.
                </p>
              </div>
              <Button className="inline-flex h-9 items-center justify-center rounded-md bg-[#22c55e] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#16a34a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]">
                <Link
                  href="https://t.me/raphgptbot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Chatting on Telegram
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-[#e6f7e6]">
        <p className="text-xs text-[#4b5563]">
          © {new Date().getFullYear()} raphGPT. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
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
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-white p-4 shadow-sm">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-[#111827]">{title}</h3>
      <p className="text-sm text-[#4b5563]">{description}</p>
    </div>
  );
}
