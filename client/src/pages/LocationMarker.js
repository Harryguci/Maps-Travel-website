import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import TooltipCircle from "../components/ToolTipCircle";
export default function LocationMarker({
  center,
  points,
  setPoints,
  setCurrentLocation,
  setAlertState,
}) {
  const [position, setPosition] = useState(center);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCurrentLocation(e.latlng);
      setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
    keypress(e) {
      if (
        e.originalEvent &&
        e.originalEvent.charCode &&
        e.originalEvent.charCode === 32
      ) {
        map.locate();
        setAlertState({
          variant: "success",
          content: "Detecting location...",
        });

        setTimeout(() => {
          setAlertState({});
        }, 3000);
      }
    },
    locationfound(e) {
      setPosition(e.latlng);
      console.log(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <>
      {/* <TooltipCircle center={position} radius={100} /> */}
      <Marker
        position={position}
        icon={
          new Icon({
            iconUrl: markerIconPng,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }
      >
        <Popup>You are here</Popup>
      </Marker>
    </>
  );
}
