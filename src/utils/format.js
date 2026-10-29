// "1394" -> "۱۳۹۴"
export const fa = (value) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

// "2017-03-21 00:00:00.000" -> "۱ فروردین ۱۳۹۶" (Persian calendar); "" if unparsable
export const formatDate = (value) => {
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "long" }).format(date);
};
