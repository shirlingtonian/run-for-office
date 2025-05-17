// game.js: Updated to accept full character object
const INITIAL_STATE = (character) => ({
  popularity: 100,
  funds: 10000,
  day: 1,
  maxDays: 10,
  party: character.party,
  character,
  states: STATES.reduce((acc, s) => { acc[s.abbr] = s.baseline; return acc; }, {}),
  history: [],
  policy: { Economy: "Neutral", Environment: "Neutral", Education: "Neutral", Healthcare: "Neutral" },
  gameOver: false,
  message: `Welcome to Run for Office as a ${character.party}!`
});

function RunForOfficeApp() {
  const [character, setCharacter] = React.useState(null);
  return character
    ? <RunForOfficeGame character={character} />
    : <CharacterCreation onStart={setCharacter} />;
}

function RunForOfficeGame({ character }) {
  const [state, setState] = React.useState(INITIAL_STATE(character));

  const log = entry => setState(prev => ({ ...prev, history: [...prev.history, entry] }));

  const nextDay = () => state.day >= state.maxDays
    ? endGame()
    : setState(prev => ({ ...prev, day: prev.day + 1 }));

  const updateAll = (popChange = 0, fundChange = 0, msg = "") => {
    setState(prev => {
      const newPop = Math.max(0, prev.popularity + popChange);
      const newFunds = Math.max(0, prev.funds + fundChange);
      const newStates = updateStatePerState(prev.states, popChange);
      const popVote = Object.values(newStates).reduce((a, b) => a + b, 0);
      const newMsg = msg || `Day ${prev.day}: No major events.`;
      return {
        ...prev,
        popularity: newPop,
        funds: newFunds,
        states: newStates,
        message: newMsg,
        history: [...prev.history, newMsg],
        popVote
      };
    });
  };

  const endGame = () => {
    const outcome = state.popularity >= 120
      ? "You won the election! 🎉"
      : "You lost the election. Better luck next time.";
    setState(prev => ({ ...prev, gameOver: true, message: outcome }));
    log(outcome);
  };

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">{state.character.name || 'Candidate'} - Run for Office</h1>
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        {state.character.name && <p><strong>Name:</strong> {state.character.name}</p>}
        {state.character.homeState && <p><strong>Home State:</strong> {state.character.homeState}</p>}
        <p><strong>Day:</strong> {state.day} / {state.maxDays}</p>
        <p><strong>Popularity:</strong> {state.popularity}</p>
        <p><strong>Popular Vote:</strong> {state.popVote || 0}</p>
        <p><strong>Funds:</strong> ${state.funds}</p>
        <p><strong>Party:</strong> {state.party}</p>
        {state.character.bio && <p><strong>Bio:</strong> {state.character.bio}</p>}
        <p className="italic">{state.message}</p>
      </div>
      <ElectoralMap states={state.states} />
      {!state.gameOver && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={actions.rally} className="bg-blue-500 text-white p-2 rounded-xl">Hold Rally</button>
          <button onClick={actions.ad} className="bg-green-500 text-white p-2 rounded-xl">Run Ad</button>
          <button onClick={actions.fundraise} className="bg-yellow-500 text-white p-2 rounded-xl">Fundraise</button>
          <button onClick={actions.debate} className="bg-purple-500 text-white p-2 rounded-xl">Debate</button>
          <button onClick={actions.rest} className="bg-gray-500 text-white p-2 rounded-xl">Rest</button>
          <button onClick={actions.quit} className="bg-red-600 text-white p-2 rounded-xl">Quit</button>
        </div>
      )}
      {state.character.traits && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Traits & Skills</h2>
          <ul>
            {Object.entries(state.character.traits).map(([t, v]) => (
              <li key={t}>{t}: {v}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="font-bold mt-4">Campaign History</h2>
        <ul className="list-disc pl-5">{state.history.map((e,i)=><li key={i}>{e}</li>)}</ul>
      </div>
    </div>
  );
}

ReactDOM.render(<RunForOfficeApp />, document.getElementById("root"));