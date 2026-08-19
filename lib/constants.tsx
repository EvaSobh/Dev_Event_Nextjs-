export type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    title: "Google I/O",
    image: "/images/event1.png",
    slug: "google-io-2026",
    location: "Mountain View, California",
    date: "May 20-22, 2026",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "GitHub Universe",
    image: "/images/event2.png",
    slug: "github-universe-2025",
    location: "San Francisco, California",
    date: "October 28-29, 2025",
    time: "9:30 AM - 5:30 PM",
  },
  {
    title: "KubeCon + CloudNativeCon",
    image: "/images/event3.png",
    slug: "kubecon-cloudnativecon-na-2025",
    location: "Chicago, Illinois",
    date: "November 10-13, 2025",
    time: "8:30 AM - 5:00 PM",
  },
  {
    title: "AWS re:Invent",
    image: "/images/event4.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, Nevada",
    date: "December 1-5, 2025",
    time: "8:00 AM - 7:00 PM",
  },
  {
    title: "Hack the North",
    image: "/images/event5.png",
    slug: "hack-the-north-2026",
    location: "Waterloo, Ontario",
    date: "September 18-20, 2026",
    time: "10:00 AM - 9:00 PM",
  },
  {
    title: "React Summit",
    image: "/images/event6.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "June 11-12, 2026",
    time: "9:00 AM - 6:00 PM",
  },
];
