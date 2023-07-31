import React, { useState, useEffect } from "react";
import { LayerGroup, Circle } from "leaflet/src/layer";

export default function LayerTerm({ center }) {
  const [centerState, setCenterState] = useState([center.lat, center.lng]);
  useEffect(() => console.log(center), [center]);

  return (
    <>
      <LayerGroup>
        <Circle center={[...centerState]} radius={30} />
      </LayerGroup>
    </>
  );
}
