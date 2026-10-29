const Footer = () => {
  return (
    <footer
      dir="rtl"
      className="w-full border-t border-emerald-400/15 bg-emerald-950/30 text-gray-300 backdrop-blur-xl"
    >
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {/* Logo */}
          <div className="flex flex-col items-start gap-4 lg:col-span-3">
            <img
              className="w-36 object-contain"
              src="https://thesaurus.isca.ac.ir/assets/images/front/logo-f.png"
              alt="لوگوی پژوهشکده"
            />

            <p className="max-w-xs text-sm leading-7 text-gray-300/80">
              پژوهشکده مدیریت اطلاعات و مدارک اسلامی
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h6 className="mb-5 text-sm font-semibold text-white">
              دسترسی سریع
            </h6>

            <ul className="flex flex-col gap-3">
              {[
                ["صفحه اصلی", "/"],
                ["اصطلاحنامه", "/term"],
                ["منابع", "/doc"],
                ["نمایه نامه", "/index"],
                ["ورود/ثبت نام", "https://adminthesaurus.isca.ac.ir"],
              ].map(([title, href]) => (
                <li key={title} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                  <a
                    href={href}
                    className="text-xs text-gray-300/80 transition-colors duration-200 hover:text-emerald-300"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Links */}
          <div className="lg:col-span-3">
            <h6 className="mb-5 text-sm font-semibold text-white">پیوندها</h6>

            <ul className="flex flex-col gap-3">
              {[
                [
                  "پژوهشکده مدیریت اطلاعات و مدارک اسلامی",
                  "https://thesaurus.isca.ac.ir/",
                ],
                ["پژوهشگاه علوم و فرهنگ اسلامی", "https://isca.ac.ir/"],
                ["دانشگاه باقرالعلوم", "https://bou.ac.ir"],
              ].map(([title, href]) => (
                <li key={title} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                  <a
                    href={href}
                    className="text-xs leading-6 text-gray-300/80 transition-colors duration-200 hover:text-emerald-300"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h6 className="mb-5 text-sm font-semibold text-white">
              تماس با ما
            </h6>

            <ul className="flex flex-col gap-3 text-xs">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                <a
                  href="https://maps.google.com/?q=قم+خیابان+معلم"
                  target="_blank"
                  rel="noreferrer"
                  className="leading-6 text-gray-300/80 transition-colors hover:text-emerald-300"
                >
                  نشانی: قم، خیابان معلم
                </a>
              </li>

              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                <a
                  href="tel:025371160"
                  dir="rtl"
                  className="text-gray-300/80 transition-colors hover:text-emerald-300"
                >
                  تلفن: 025-371160
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-5 text-center">
          <p className="text-[11px] leading-6 text-gray-400/80 sm:text-xs">
            کلیه حقوق این پایگاه متعلق به پژوهشگاه علوم و فرهنگ اسلامی (وابسته
            به دفتر تبلیغات اسلامی حوزه علمیه قم) می‌باشد.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
