import { CameraIcon, Edit3Icon } from "lucide-react";

export type NavigationLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const navigationLinks: NavigationLink[] = [
  {
    label: "writing",
    href: "/writing",
    icon: <Edit3Icon />,
  },
  {
    label: "photography",
    href: "https://instagram.com/raphtlw",
    icon: <CameraIcon />,
  },
];
