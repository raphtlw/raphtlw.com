import { CameraIcon, Edit3Icon, ForkKnifeIcon, GlobeIcon } from "lucide-react";

export type NavigationLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const navigationLinks: NavigationLink[] = [
  {
    label: "need a website?",
    href: "/freelancing",
    icon: <GlobeIcon />,
  },
  {
    label: "writing",
    href: "/posts",
    icon: <Edit3Icon />,
  },
  {
    label: "recipes",
    href: "/recipes",
    icon: <ForkKnifeIcon />,
  },
  {
    label: "photography",
    href: "/photography",
    icon: <CameraIcon />,
  },
];
