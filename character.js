
function CharacterCreation({ onStart }) {
  const [party, setParty] = React.useState("");

  const startGame = () => {
    if (!party) return alert("Please choose a party before starting.");
    onStart(party);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Create Your Candidate</h1>
      <p>Select your political party to begin your campaign.</p>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="radio" name="party" value="Democrat" onChange={() => setParty("Democrat")} />
          Democrat
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="party" value="Republican" onChange={() => setParty("Republican")} />
          Republican
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="party" value="Independent" onChange={() => setParty("Independent")} />
          Independent
        </label>
      </div>

      <button
        onClick={startGame}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Start Campaign
      </button>
    </div>
  );
}
