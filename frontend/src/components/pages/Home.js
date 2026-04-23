import React, { useEffect, useState } from "react";
import Card from "../UIC/Card";
import FeaturedCard from "../UIC/FeaturedCard";
import axios from "axios";
import { baseUrl } from "../../url";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/api/trip`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (data.length > 0) {
    return (
      <div style={{ margin: "2%" }}>
        {data.map((e) =>
          e.featured ? (
            <FeaturedCard
              key={e._id}
              title={e.tripName}
              tripType={e.tripType}
              description={e.shortDescription}
              id={e._id}
            />
          ) : null
        )}

        {data.map((e) =>
          !e.featured ? (
            <Card
              key={e._id}
              title={e.tripName}
              tripType={e.tripType}
              description={e.shortDescription}
              id={e._id}
            />
          ) : null
        )}
      </div>
    );
  } else {
    return <>Loading...</>;
  }
}