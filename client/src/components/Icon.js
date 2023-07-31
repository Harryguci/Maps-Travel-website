import L from "leaflet";
// import src from "http://localhost:3000/marker-pin-person.png";

const iconPerson = new L.Icon({
  iconUrl: 'http://localhost:3000/marker-pin-person.png',
  iconRetinaUrl: 'http://localhost:3000/marker-pin-person.png',
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 75),
  className: "leaflet-div-icon",
});

export { iconPerson };
