import React, { useState, useEffect, useRef } from "react";

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      const { scrollHeight, clientHeight, scrollTop } =
        scrollContainerRef.current;
      const reachedBottom = scrollHeight - clientHeight * 1.2 <= scrollTop + 1;

      if (reachedBottom) {
        setLoading(true);

        fetch(`https://my-api/items?page=${page}`)
          .then((response) => response.json())
          .then((data) => {
            setItems(items.concat(data));
            setPage(page + 1);
            setLoading(false);
          });
      }
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading]);

  return (
    <div ref={scrollContainerRef} className="infinite-scroll">
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}
