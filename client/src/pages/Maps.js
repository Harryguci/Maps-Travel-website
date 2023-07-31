// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useLayoutEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Assets/SCSS/maps.scss";
import {
  // eslint-disable-next-line no-unused-vars
  Circle,
  // eslint-disable-next-line no-unused-vars
  CircleMarker,
  // eslint-disable-next-line no-unused-vars
  Popup,
  // eslint-disable-next-line no-unused-vars
  Rectangle,
  // eslint-disable-next-line no-unused-vars
  Tooltip,
  // eslint-disable-next-line no-unused-vars
  LayersControl,
  // eslint-disable-next-line no-unused-vars
  Marker,
  // eslint-disable-next-line no-unused-vars
  LayerGroup,
  // eslint-disable-next-line no-unused-vars
  FeatureGroup,
} from "react-leaflet";

// eslint-disable-next-line no-unused-vars
import TooltipCircle from "../components/ToolTipCircle";
import LocationMarker from "./LocationMarker";
// eslint-disable-next-line no-unused-vars
import LayerTerm from "../components/LayerTerm";
import attributions from "../helpers/osmProvider";
import ToolTipPoly from "../components/ToolTipPoly";
import "bootstrap/dist/css/bootstrap.css";
import {
  // eslint-disable-next-line no-unused-vars
  Button,
  ListGroup,
  ListGroupItem,
  FormControl,
  Container,
  Row,
  Col,
  Form,
  Alert,
} from "react-bootstrap";
// import polygonArea from "../helpers/polygonArea";
import convertVNtoEng from "../helpers/convertVNtoEng";
const hanoipoints = [
  [21.079374593525337, 105.89481353759767],
  [21.07376838647649, 105.92348098754884],
  [21.061914567119807, 105.92948913574219],
  [21.046695441515006, 105.93584060668947],
  [21.039966489991286, 105.93824386596681],
  [21.034999687911917, 105.94734191894533],
  [21.028911123993602, 105.95111846923828],
  [21.022982546427425, 105.95197677612306],
  [21.014970580547725, 105.948543548584],
  [21.00968244727318, 105.94528198242189],
  [21.00054795738831, 105.93858718872072],
  [20.993496389857583, 105.9346389770508],
  [20.951500617754565, 105.90923309326172],
  [20.94027837682011, 105.90030670166017],
  [20.936751213064184, 105.87215423583986],
  [20.939316431308203, 105.85018157958986],
  [20.952462484967604, 105.80760955810548],
  [20.978109995719024, 105.78014373779297],
  [20.99189371442306, 105.7602310180664],
  [21.008240196572455, 105.74752807617189],
  [21.03836431386586, 105.7379150390625],
  [21.073608206025916, 105.72830200195314],
  [21.09026604845475, 105.74340820312501],
  [21.098594269392102, 105.75576782226564],
  [21.09410990075993, 105.81275939941408],
  [21.092828627710034, 105.82408905029297],
  [21.086742429803333, 105.83747863769533],
  [21.08097632813527, 105.84571838378906],
  [21.07264711969881, 105.8577346801758],
  [21.071686027159775, 105.86803436279297],
  [21.073287844607105, 105.87284088134767],
];

function createId(name) {
  return convertVNtoEng(name).trim().toLowerCase().replace(/ /g, "-");
}

export default function Maps() {
  const [center, setCenter] = useState({ lat: 21.023997, lng: 105.806099 });
  const [points, setPoints] = useState([]);
  const [showPolygon, setShowPolygon] = useState(false);

  const [cites, setCites] = useState([]);

  const [currentLocation, setCurrentLocation] = useState({
    lat: 21.023997,
    lng: 105.806099,
  });

  const [newCityState, setNewCityState] = useState("");
  const [weatherData, setWeatherData] = useState({});

  const [alertState, setAlertState] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/points/data")
      .then((response) => response.json())
      .then((data) => setCites(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lng}&appid=be05f4fc63cacfee5809402834381803`
    )
      .then((response) => response.json())
      .then((response) => {
        // Convert from K temp to C temp

        response.main.temp = Math.round(response.main.temp - 273);
        response.main.temp_max = Math.round(response.main.temp_max - 273);
        response.main.temp_min = Math.round(response.main.temp_min - 273);
        response.main.feels_like = Math.round(response.main.feels_like - 273);

        setWeatherData(response);
      })
      .catch((err) => console.log(err));
  }, [currentLocation]);

  const handleAddPlace = async (e) => {
    cites.push({
      id: createId(newCityState),
      name: newCityState,
      points: points,
    });

    setPoints([]);

    await fetch("http://localhost:3001/points/data", {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: createId(newCityState),
        name: newCityState,
        points: points,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("POST", data))
      .catch((err) => console.log(err));
  };

  useEffect(() => console.log(alertState), [alertState]);

  return (
    <>
      <div
        className="information-box"
        style={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          zIndex: 100,
          boxShadow: "5px 5px 30px rgba(0,0,0,0.3)",
        }}
      >
        <ListGroup>
          <ListGroupItem>
            Tỉnh / Thành phố:
            <b className="mx-2">{weatherData.name || "~"}</b>
          </ListGroupItem>
          <ListGroupItem>
            Nhiệt độ:
            <b className="mx-2">
              {(weatherData.main && weatherData.main.temp) || "~"}
            </b>
          </ListGroupItem>
          <ListGroupItem>
            Cảm giác như:
            <b className="mx-2">
              {(weatherData.main && weatherData.main.feels_like) || "~"}
            </b>
          </ListGroupItem>
          <ListGroupItem>
            Nhiệt độ cao nhất:
            <b className="mx-2">
              {(weatherData.main && weatherData.main.temp_max) || "~"}
            </b>
          </ListGroupItem>
          <ListGroupItem>
            Nhiệt độ thấp nhất:
            <b className="mx-2">
              {(weatherData.main && weatherData.main.temp_min) || "~"}
            </b>
          </ListGroupItem>
          <ListGroupItem>
            Độ ẩm:
            <b className="mx-2">
              {(weatherData.main && weatherData.main.humidity) || "~"}
            </b>
          </ListGroupItem>
          <ListGroupItem>
            Tốc độ gió:
            <b className="mx-2">
              {(weatherData.wind && weatherData.wind.speed) || "~"}
            </b>
          </ListGroupItem>
          <ListGroupItem>
            Lượng mưa:
            <b className="mx-2">
              {(weatherData.rain && weatherData.rain["1h"]) || "~"}
            </b>
          </ListGroupItem>
        </ListGroup>
      </div>

      <Container
        fluid
        className="maps-section position-relative"
        style={{ zIndex: 5 }}
      >
        <Row>
          <Col className="maps-section__control p-4">
            <Row>
              <h3 className="brand">Harryguci</h3>
            </Row>
            <Row className="my-2 d-flex justify-content-center gap-2">
              {cites &&
                cites.length &&
                cites.map((city) => (
                  <button
                    key={city.id}
                    className="custom-button"
                    onClick={(e) => {
                      setCenter({
                        lat: city.points[0][0],
                        lng: city.points[0][1],
                      });
                      setPoints(city.points || hanoipoints);
                    }}
                  >
                    {city.name}
                  </button>
                ))}
              <button
                className="custom-button danger"
                onClick={(e) => setPoints([])}
              >
                Reset
              </button>
            </Row>
            <Row className="d-flex justify-content-center my-5 gap-2">
              <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Show poly"
                onChange={(e) => setShowPolygon((prev) => !prev)}
              />
              <FormControl
                type="text"
                style={{ maxWidth: 500 }}
                value={newCityState}
                onChange={(e) => setNewCityState(e.target.value)}
              />
              <button
                className="custom-button primary"
                onClick={handleAddPlace}
              >
                Add
              </button>
            </Row>
            <Row>
              <div className="opacity-50">
                <p>[space] back to current location</p>
                <p>[-][+] change zoom</p>
              </div>
            </Row>
          </Col>
          <Col className="maps-section__main">
            {alertState && alertState.content && (
              <Alert
                key={JSON.stringify(alertState)}
                variant={alertState.variant}
              >
                {alertState.content}
              </Alert>
            )}
            <Row>
              {(center && (
                <MapContainer
                  key={JSON.stringify([center.lat, center.lng])}
                  center={center}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100vh", position: "relative", zIndex: 5 }}
                >
                  <LocationMarker
                    center={center}
                    points={points}
                    setPoints={setPoints}
                    setCurrentLocation={setCurrentLocation}
                    setAlertState={setAlertState}
                  />
                  <TileLayer {...attributions} />
                  {showPolygon && points && points.length && (
                    <ToolTipPoly points={points} />
                  )}
                </MapContainer>
              )) || <h1>Detecting...</h1>}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
