/* electoral.js – no external libraries */
const STATES = [
  { name: "California", abbr: "CA", votes: 55, baseline: 120, sensitivity: 1.2,
    /* simplified SVG path (Albers USA projection) */
    d: "M43.7 98.4L40 87.7l2-10.7 9-6.2 9.8 3.5 7.6-4.1 6.8 3.4 1.4 9.2-5 8.9-7.9 5.9-17.3 .8z"},
  { name: "Texas", abbr: "TX", votes: 38, baseline: 90, sensitivity: 1.0,
    d: "M133 125l-1.7-10.2 6.5-7.3 10.4-.8 6.1 4.6 9.6-4.8 6.3 6.1 1.3 10.8-37.5 1.6z"},
  { name: "Florida", abbr: "FL", votes: 29, baseline: 100, sensitivity: 0.9,
    d: "M198 116l8.1-6.2 12.8 3.9 9.3-2.1 1.7 6.8-6.6 5.5-13.8-.4-11.5-7.5z"},
  { name: "New York", abbr: "NY", votes: 29, baseline: 110, sensitivity: 1.1,
    d: "M199 52l5.9-7.8 10.4 1.7 9.5-5.4 5.1 4.6-4.2 7.6-11.2 4.4-15.5-4.7z"},
  { name: "Illinois", abbr: "IL", votes: 20, baseline: 95, sensitivity: 1.0,
    d: "M146 78l6.4-9.6 11.1-.6 6.7 8.7-5.9 9.8-11.2 .9-7.1-9.2z"}
];

/* helper to update each state by sensitivity */
function updateStatePerState(states, change) {
  const ns = {};
  STATES.forEach(s => {
    const next = Math.round(Math.max(0, states[s.abbr] + change * s.sensitivity));
    ns[s.abbr] = next;
  });
  return ns;
}

/* SVG width/height tuned for these 5 shapes */
function ElectoralMap({ states }) {
  return (
    <svg viewBox="0 0 260 160" className="mx-auto block">
      {STATES.map(st => {
        const support = states[st.abbr];
        const opacity = Math.min(1, Math.max(0, support / 200));
        const fill = `rgba(59,130,246,${opacity})`;
        return (
          <path key={st.abbr}
            d={st.d}
            fill={fill}
            stroke="#fff"
            strokeWidth="0.8"
            onMouseEnter={e => e.target.style.stroke = "#000"}
            onMouseLeave={e => e.target.style.stroke = "#fff"}
          >
            <title>{st.name} – {support} support • {st.votes} EV</title>
          </path>
        );
      })}
    </svg>
  );
}
