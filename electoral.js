// electoral.js: Defines states with personalities and renders an electoral map
const STATES = [
  { name: 'California', abbr: 'CA', votes: 55, baseline: 120, sensitivity: 1.2 },
  { name: 'Texas',      abbr: 'TX', votes: 38, baseline: 90,  sensitivity: 1.0 },
  { name: 'Florida',    abbr: 'FL', votes: 29, baseline: 100, sensitivity: 0.9 },
  { name: 'New York',   abbr: 'NY', votes: 29, baseline: 110, sensitivity: 1.1 },
  { name: 'Illinois',   abbr: 'IL', votes: 20, baseline: 95,  sensitivity: 1.0 }
];

function updateStatePerState(states, change) {
  const newStates = {};
  STATES.forEach(s => {
    const prevVal = states[s.abbr];
    const delta = change * s.sensitivity;
    newStates[s.abbr] = Math.round(Math.max(0, prevVal + delta));
  });
  return newStates;
}

const US_TOPO_JSON = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

function ElectoralMap({ states }) {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <ReactSimpleMaps.ComposableMap projection="geoAlbersUsa">
        <ReactSimpleMaps.Geographies geography={US_TOPO_JSON}>
          {({ geographies }) =>
            geographies
              .filter(d => STATES.some(s => s.name === d.properties.name))
              .map(geo => {
                const st = STATES.find(s => s.name === geo.properties.name);
                const support = states[st.abbr];
                const opacity = Math.min(1, Math.max(0, support / 200));
                return (
                  <ReactSimpleMaps.Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={`rgba(59,130,246,${opacity})`}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    style={{
                      hover: {
                        stroke: "#000",
                        strokeWidth: 2
                      }
                    }}
                  />
                );
              })
          }
        </ReactSimpleMaps.Geographies>
      </ReactSimpleMaps.ComposableMap>
    </div>
  );
}