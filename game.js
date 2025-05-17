// game.js integrates electoral map into the game
const INITIAL_STATE = (party) => ({
  popularity: 100,
  funds: 10000,
  day: 1,
  maxDays: 10,
  party: party,
  // initialize all states with 100 support
  states: STATES.reduce((acc, s) => { acc[s.abbr] = 100; return acc; }, {}),
  history: [],
  policy: { Economy: "Neutral", Environment: "Neutral", Education: "Neutral", Healthcare: "Neutral" },
  gameOver: false,
  message: `Welcome to Run for Office as a ${party}!`
});

function RunForOfficeApp() {
  const [party, setParty] = React.useState(null);
  return party
    ? <RunForOfficeGame party={party} />
    : <CharacterCreation onStart={setParty} />;
}

function RunForOfficeGame({ party }) {
  const [state, setState] = React.useState(INITIAL_STATE(party));

  const log = (entry) => setState(prev => ({ ...prev, history: [...prev.history, entry] }));

  const nextDay = () => {
    if (state.day >= state.maxDays) endGame();
    else setState(prev => ({ ...prev, day: prev.day + 1 }));
  };

  const updateAll = (popChange = 0, fundChange = 0, msg = "") => {
    setState(prev => {
      // update global popularity/funds
      const newPop = Math.max(0, prev.popularity + popChange);
      const newFunds = Math.max(0, prev.funds + fundChange);
      // update each state's support
      const newStates = updateStatePerState(prev.states, popChange);
      const newMsg = msg || `Day ${prev.day}: No major events.`;
      return {
        ...prev,
        popularity: newPop,
        funds: newFunds,
        states: newStates,
        message: newMsg,
        history: [...prev.history, newMsg]
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

  const actions = {
    rally:    () => { if(state.funds<2000) return updateAll(0,0,"Not enough funds."); const gain = Math.random()<0.7?rand(5,15):-rand(5,15); updateAll(gain,-2000,`Held a rally. ${gain>=0?'+':''}${gain} pop.`); nextDay(); },
    ad:       () => { if(state.funds<3000) return updateAll(0,0,"Not enough funds."); const gain=rand(5,20); updateAll(gain,-3000,`Ran an ad. +${gain} pop.`); nextDay(); },
    fundraise:() => { const m=rand(2000,4000), l=rand(2,5); updateAll(-l,m,`Fundraised. +$${m}, -${l} pop.`); nextDay(); },
    debate:   () => { const g=rand(10,20), w=Math.random()<0.5; updateAll(w?g:-g,0, w?`Won debate. +${g} pop.`:`Lost debate. -${g} pop.`); nextDay(); },
    rest:     () => { updateAll(0,0,"You rested. No changes."); nextDay(); },
    quit:     () => { setState(prev=>({...prev,gameOver:true,message:"You quit."})); log("Quit campaign."); }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Run for Office</h1>
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Day:</strong> {state.day} / {state.maxDays}</p>
        <p><strong>Popularity:</strong> {state.popularity}</p>
        <p><strong>Funds:</strong> ${state.funds}</p>
        <p><strong>Party:</strong> {state.party}</p>
        <p className="italic">{state.message}</p>
      </div>
      {/* Electoral map */}
      <ElectoralMap states={state.states} />
      {!state.gameOver && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={actions.rally}    className="bg-blue-500   text-white p-2 rounded-xl">Hold Rally</button>
          <button onClick={actions.ad}       className="bg-green-500  text-white p-2 rounded-xl">Run Ad</button>
          <button onClick={actions.fundraise}className="bg-yellow-500 text-white p-2 rounded-xl">Fundraise</button>
          <button onClick={actions.debate}   className="bg-purple-500 text-white p-2 rounded-xl">Debate</button>
          <button onClick={actions.rest}     className="bg-gray-500   text-white p-2 rounded-xl">Rest</button>
          <button onClick={actions.quit}     className="bg-red-600    text-white p-2 rounded-xl">Quit</button>
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