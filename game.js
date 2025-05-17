// game.js: Updated with fixes
const INITIAL_STATE = (character) => {
  const states = STATES.reduce((acc, s) => { acc[s.abbr] = s.baseline; return acc; }, {});
  const popVote = Object.values(states).reduce((a,b) => a + b, 0);
  return {
    popularity: 100,
    funds: 10000,
    day: 1,
    maxDays: 10,
    party: character.party,
    character,
    states,
    popVote,
    history: [],
    policy: { Economy: "Neutral", Environment: "Neutral", Education: "Neutral", Healthcare: "Neutral" },
    gameOver: false,
    message: `Welcome to Run for Office as a ${character.party}!`
  };
};

function RunForOfficeApp() {
  const [character, setCharacter] = React.useState(null);
  return character
    ? <RunForOfficeGame character={character} />
    : <CharacterCreation onStart={setCharacter} />;
}

function RunForOfficeGame({ character }) {
  const [state, setState] = React.useState(INITIAL_STATE(character));

  const log = entry => setState(prev => ({ ...prev, history: [...prev.history, entry] }));

  const nextDay = () => setState(prev => {
    const newDay = prev.day + 1;
    if (newDay > prev.maxDays) {
      const outcome = prev.popularity >= WINNING_POPULARITY
        ? "You won the election! 🎉"
        : "You lost the election. Better luck next time.";
      log(outcome);
      return { ...prev, gameOver: true, message: outcome, day: prev.day };
    }
    return { ...prev, day: newDay };
  });

  const updateAll = (popChange = 0, fundChange = 0, msg = "") => {
    setState(prev => {
      const newPop = Math.max(0, prev.popularity + popChange);
      const newFunds = Math.max(0, prev.funds + fundChange);
      const newStates = updateStatePerState(prev.states, popChange);
      const popVote = Object.values(newStates).reduce((a, b) => a + b, 0);
      const newMsg = msg || `Day ${prev.day}: No major events.`;
      return { ...prev, popularity: newPop, funds: newFunds, states: newStates, popVote, message: newMsg, history: [...prev.history, newMsg] };
    });
  };

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const actions = {
    rally:    () => { if(state.funds < 2000) return updateAll(0, 0, "Not enough funds for a rally."); const gain = Math.random() < 0.7 ? rand(5,15) : -rand(5,15); updateAll(gain, -2000, `Held a rally. ${gain>=0?'+':''}${gain} pop.`); nextDay(); },
    ad:       () => { if(state.funds < 3000) return updateAll(0,0,"Not enough funds for an ad."); const gain = rand(5,20); updateAll(gain, -3000, `Ran an ad. +${gain} pop.`); nextDay(); },
    fundraise:() => { const m = rand(2000,4000), l = rand(2,5); updateAll(-l, m, `Fundraised. +$${m}, -${l} pop.`); nextDay(); },
    debate:   () => { const g = rand(10,20), w = Math.random() < 0.5; updateAll(w?g:-g, 0, w?`Won debate. +${g} pop.`:`Lost debate. -${g} pop.`); nextDay(); },
    rest:     () => { updateAll(0,0,"You rested. No changes."); nextDay(); },
    quit:     () => { setState(prev => ({ ...prev, gameOver: true, message: "You quit the campaign." })); log("You quit the campaign."); }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">{state.character.name || 'Candidate'} - Run for Office</h1>
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        {state.character.name && <p><strong>Name:</strong> {state.character.name}</p>}
        {state.character.homeState && <p><strong>Home State:</strong> {state.character.homeState}</p>}
        <p><strong>Day:</strong> {state.day} / {state.maxDays}</p>
        <p><strong>Popularity:</strong> {state.popularity}</p>
        <p><strong>Popular Vote:</strong> {state.popVote}</p>
        <p><strong>Funds:</strong> ${state.funds}</p>
        <p><strong>Party:</strong> {state.party}</p>
        {state.character.bio && <p><strong>Bio:</strong> {state.character.bio}</p>}
        {state.character.maritalStatus && <p><strong>Marital Status:</strong> {state.character.maritalStatus}</p>}
        {state.character.educationLevel && <p><strong>Education Level:</strong> {state.character.educationLevel}</p>}
        {state.character.institution && <p><strong>Institution:</strong> {state.character.institution}</p>}
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
      <div>
        <h2 className="font-bold mt-4">Campaign History</h2>
        <ul className="list-disc pl-5">{state.history.map((e,i)=><li key={i}>{e}</li>)}</ul>
      </div>
    </div>
  );
}

ReactDOM.render(<RunForOfficeApp />, document.getElementById("root"));
