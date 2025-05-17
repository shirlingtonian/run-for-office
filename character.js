// character.js: Enhanced candidate creation with optional fields
function CharacterCreation({ onStart }) {
  const [party, setParty] = React.useState("");
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [homeState, setHomeState] = React.useState("");
  const [maritalStatus, setMaritalStatus] = React.useState("");
  const [educationLevel, setEducationLevel] = React.useState("");
  const [institution, setInstitution] = React.useState("");
  const [traits, setTraits] = React.useState({
    Charisma: 5,
    Strategy: 5,
    Fundraising: 5,
    PublicSpeaking: 5
  });

  const startGame = () => {
    if (!party) return alert("Please choose a party before starting.");
    onStart({
      party, name, bio, homeState,
      maritalStatus, educationLevel, institution, traits
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Create Your Candidate</h1>
      <p>Select your political party to begin your campaign.</p>
      <div className="flex flex-col gap-2">
        <label><input type="radio" name="party" value="Democrat" onChange={() => setParty("Democrat")} /> Democrat</label>
        <label><input type="radio" name="party" value="Republican" onChange={() => setParty("Republican")} /> Republican</label>
        <label><input type="radio" name="party" value="Independent" onChange={() => setParty("Independent")} /> Independent</label>
      </div>

      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Bio (optional)"
        value={bio}
        onChange={e => setBio(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select value={homeState} onChange={e => setHomeState(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Home State (optional)</option>
        <option value="California">California</option>
        <option value="Texas">Texas</option>
        <option value="Florida">Florida</option>
        <option value="New York">New York</option>
        <option value="Illinois">Illinois</option>
      </select>

      <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Marital Status (optional)</option>
        <option value="Single">Single</option>
        <option value="Married">Married</option>
        <option value="Divorced">Divorced</option>
      </select>

      <select value={educationLevel} onChange={e => setEducationLevel(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Education Level (optional)</option>
        <option value="High School">High School</option>
        <option value="Bachelor's">Bachelor's</option>
        <option value="Master's">Master's</option>
        <option value="PhD">PhD</option>
      </select>

      <input
        type="text"
        placeholder="Educational Institution (optional)"
        value={institution}
        onChange={e => setInstitution(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <h2 className="font-bold mt-4">Traits & Skills (1–10)</h2>
      <div className="space-y-2">
        {Object.entries(traits).map(([t, val]) => (
          <div key={t} className="flex items-center gap-2">
            <label className="w-32">{t}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={val}
              onChange={e => setTraits(prev => ({ ...prev, [t]: +e.target.value }))}
            />
            <span>{val}</span>
          </div>
        ))}
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