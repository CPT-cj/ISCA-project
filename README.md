# ISCA Website Redesign 🕌

[English](#english) · [فارسی](#فارسی)

## English

Hey! This is a fresh, mobile-friendly redesign of the ISCA thesaurus website. You can browse Islamic-sciences terms, domains and sources, flip between light and dark mode, and poke around an interactive graph of related terms.

**Built with:** JavaScript (JSX) · React · Vite · Tailwind CSS · React Router · Cytoscape.js

### Run it

You just need [Node.js](https://nodejs.org/) installed.

```bash
git clone <repository-url>
cd <project-directory>
npm install
npm run dev
```

Open the link that shows up in your terminal. Done!

Want a production build? Run `npm run build` and grab the files from `dist/`.

### What's where

```
src/
├── components/   # reusable stuff (top bar, pagination, stats...)
├── hooks/        # fetching data from the API
├── pages/        # Home, domain, term, doc, index
├── theme/        # light / dark mode
├── utils/        # small helpers
└── routes.jsx    # all the routes
```

---

<div dir="rtl">

## فارسی

سلام! این بازطراحیِ سایت اصطلاح‌نامه‌ی ISCA هست؛ ریسپانسیو و راحت. توش می‌تونی اصطلاحات، دامنه‌ها و منابع علوم اسلامی رو ببینی، بین حالت روشن و تیره جابه‌جا بشی و یه گراف تعاملی از اصطلاحات مرتبط رو بچرخونی.

**ساخته‌شده با:** جاوااسکریپت (JSX) · React · Vite · Tailwind CSS · React Router · Cytoscape.js

### چطوری راهش بندازم؟

فقط کافیه [Node.js](https://nodejs.org/) روی سیستمت نصب باشه.

```bash
git clone <repository-url>
cd <project-directory>
npm install
npm run dev
```

لینکی که تو ترمینال میاد رو باز کن. تمام!

نسخه‌ی نهایی می‌خوای؟ `npm run build` رو بزن و فایل‌ها رو از پوشه‌ی `dist/` بردار.

### چی کجاست؟

```
src/
├── components/   # کامپوننت‌های مشترک (نوار بالا، صفحه‌بندی، آمار و...)
├── hooks/        # گرفتن دیتا از API
├── pages/        # صفحه‌ها: Home، domain، term، doc، index
├── theme/        # حالت روشن / تیره
├── utils/        # ابزارهای کوچیک
└── routes.jsx    # مسیرها
```

</div>
