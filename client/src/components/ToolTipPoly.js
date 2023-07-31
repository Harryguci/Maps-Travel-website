import { Popup, Polygon, Tooltip } from "react-leaflet";

export default function ToolTipPoly({ points }) {
  return (
    <>
      {(points && points.length && (
        <Polygon pathOptions={{ color: "blue" }} positions={points}>
          <Tooltip>Ha Noi, Viet Nam</Tooltip>
        </Polygon>
      )) || <Popup>Can not display</Popup>}
    </>
  );
}
