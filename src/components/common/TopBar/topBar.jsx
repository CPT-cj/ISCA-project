import Header from "./Header/header";
import CardNav from "./Header/nav";

const navItems = [
  {
    label: "اصطلاحنامه",
    links: [
      {
        label: "جستجوی اصطلاحنامه",
        href: "/term",
        ariaLabel: "جستجوی اصطلاحنامه",
      },
      {
        label: "آرشیو اصطلاحنامه",
        href: "/term",
        ariaLabel: "اصطلاح نامه",
      },
    ],
  },
  {
    label: "نمایه",
    links: [
      { label: "جستجوی نمایه", href: "/index", ariaLabel: "جستجوی نمایه" },
      { label: "آرشیو نمایه", href: "/index", ariaLabel: "آرشیو نمایه" },
    ],
  },
  {
    label: "کتابخانه",
    links: [
      { label: "جستجوی کتابخانه", href: "/doc", ariaLabel: "جستجوی کتابخانه" },
      { label: "آرشیو کتابخانه", href: "/doc", ariaLabel: "آرشیو کتابخانه" },
    ],
  },
];

const topBar = () => {
  return (
    <div className="flex flex-col items-center">
      <CardNav items={navItems} />
      <Header />
    </div>
  );
};

export default topBar;
