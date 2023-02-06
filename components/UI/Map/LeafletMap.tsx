import Map from "@/components/UI/Map/Map";
import { MarkerData } from "@/mocks/types";
import { LeafletMouseEvent } from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Fragment, useState } from "react";
import styles from "./Map.module.css";
import { Marker, TileLayer } from "react-leaflet";
import { DEFAULT_CENTER, DEFAULT_IMPORTANCY, DEFAULT_ZOOM } from "./utils";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>();
const maps: any = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    att: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
  },
  googlemap: {
    url: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
    att: "google",
  },
  kgm: {
    url: "http://yol.kgm.gov.tr/wmts/kar_muc/gm_grid/{z}/{x}/{y}.png",
    att: "KGM",
  },
};
const MarkerClusterGroup = dynamic(() => import("./MarkerClusterGroup"), {
  ssr: false,
});

const MapLegend = dynamic(() => import("./MapLegend"), {
  ssr: false,
});

type Props = {
  data: MarkerData[];

  onClickMarker: (_e: LeafletMouseEvent, _markerData: MarkerData) => void;
};

function LeafletMap({ onClickMarker, data }: Props) {
  const [firstMap, setFirstMap] = useState("osm");
  const [display, setDisplay] = useState(true);
  return (
    <>
      <MapLegend />
      <Map center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
        <TileLayer url={maps[firstMap].url} attribution={maps[firstMap].att} />
        <div
          onClick={() => {
            setDisplay(!display);
          }}
          className={styles.dropdownMenu}
        >
          <div
            style={{
              paddingBottom: 8,
              paddingLeft: 5,
              borderBottom: "1px solid black",
            }}
          >
            Haritalar
          </div>
          <div
            style={{
              display: display ? "none" : "flex",
              flexDirection: "column",
            }}
          >
            <button
              className={styles.mapbtns}
              onClick={() => setFirstMap("googlemap")}
            >
              Harita 1
            </button>
            <button
              className={styles.mapbtns}
              onClick={() => setFirstMap("osm")}
            >
              Harita 2
            </button>
            <button
              className={styles.mapbtns}
              onClick={() => setFirstMap("kgm")}
            >
              Harita 3
            </button>
          </div>
        </div>
        <MarkerClusterGroup>
          {data.map((marker: MarkerData) => (
            <Fragment key={marker.place_id}>
              <Marker
                key={marker.place_id}
                position={[
                  marker.geometry.location.lat,
                  marker.geometry.location.lng,
                ]}
                eventHandlers={{
                  click: (e) => {
                    onClickMarker(e, marker);
                  },
                }}
              />

              <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                radius={15}
                points={[
                  [
                    marker.geometry.location.lat,
                    marker.geometry.location.lng,
                    DEFAULT_IMPORTANCY,
                  ],
                ]}
                longitudeExtractor={(m) => m[1]}
                latitudeExtractor={(m) => m[0]}
                intensityExtractor={(m) => m[2]}
              />
            </Fragment>
          ))}
        </MarkerClusterGroup>
      </Map>
    </>
  );
}

export default LeafletMap;
