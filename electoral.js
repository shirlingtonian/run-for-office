// electoral.js: Defines states and renders an electoral map
const STATES = [
  { name: 'California', abbr: 'CA', votes: 55 },
  { name: 'Texas',      abbr: 'TX', votes: 38 },
  { name: 'Florida',    abbr: 'FL', votes: 29 },
  { name: 'New York',   abbr: 'NY', votes: 29 },
  { name: 'Illinois',   abbr: 'IL', votes: 20 }
];

function updateStatePerState(states, change) {
  const newStates = {};
  Object.keys(states).forEach(abbr => {
    const val = states[abbr] + change;
    newStates[abbr] = Math.max(0, val);
  });
  return newStates;
}

function ElectoralMap({ states }) {
  return (
    <div className="p-4 grid grid-cols-3 gap-4 max-w-xl mx-auto">
      {STATES.map(s => {
        const support = states[s.abbr];
        const opacity = Math.min(1, Math.max(0, support / 200));
        const bg = `rgba(59,130,246,${opacity})`;
        return (
          <div key={s.abbr} className="p-3 rounded text-white" style={{ backgroundColor: bg }}>
            <div className="font-bold">{s.abbr}</div>
            <div>{support}</div>
            <div>{s.votes} EV</div>
          </div>
        );
      })}
    </div>
  );
}