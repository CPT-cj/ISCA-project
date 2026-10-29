import LatestDocs from "../../components/common/LatestDocs/latestDocs";

const Doc = () => {
  return (
    <div className="mx-auto w-[90%] max-w-4xl pb-24">
      <LatestDocs
        title="جدیدترین منابع"
        endpoint="new"
        emptyText="منبعی برای نمایش وجود ندارد."
      />
    </div>
  );
};

export default Doc;
