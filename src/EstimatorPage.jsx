// import React, { useState, useEffect, useContext } from 'react';
// import { doc, setDoc, onSnapshot } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';
// import { AppContext } from './App'; // If in same file, no need to import; else import context

// const EstimatorPage = ({ setShowLoginPage }) => {
//   const { db, auth, userId, isAuthReady } = useContext(AppContext);
//   const appId = 'default-app-id'; // Or your app-specific ID

//   const [appliances, setAppliances] = useState([]);
//   const [newAppliance, setNewAppliance] = useState({ name: '', wattage: '', hours: '', isOn: true });
//   const [electricityCostPerKWH, setElectricityCostPerKWH] = useState(0.15);
//   const [aiTips, setAiTips] = useState([]);
//   const [loadingTips, setLoadingTips] = useState(false);
//   const [calculationError, setCalculationError] = useState(null);
//   const [saveLoadStatus, setSaveLoadStatus] = useState('');
//   const [isSaving, setIsSaving] = useState(false);

//   // Load saved appliances from Firestore
//   useEffect(() => {
//     if (db && userId && isAuthReady) {
//       const userAppliancesRef = doc(db, `artifacts/${appId}/users/${userId}/appliances`, 'myAppliances');
//       const unsubscribe = onSnapshot(userAppliancesRef, (docSnap) => {
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           if (data && data.list) {
//             try {
//               const loadedAppliances = JSON.parse(data.list);
//               const appliancesWithToggle = loadedAppliances.map(app => ({
//                 ...app,
//                 isOn: typeof app.isOn === 'boolean' ? app.isOn : true
//               }));
//               setAppliances(appliancesWithToggle);
//               setSaveLoadStatus('Profiles loaded!');
//             } catch (e) {
//               setSaveLoadStatus('Error loading profile data.');
//               setAppliances([]);
//             }
//           }
//         } else {
//           setSaveLoadStatus('No saved profile found.');
//         }
//       }, (error) => {
//         setSaveLoadStatus('Error loading profile: ' + error.message);
//       });

//       return () => unsubscribe();
//     }
//   }, [db, userId, isAuthReady, appId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAppliance(prev => ({ ...prev, [name]: value }));
//   };

//   const addAppliance = () => {
//     const { name, wattage, hours } = newAppliance;
//     if (name && wattage > 0 && hours > 0) {
//       setAppliances(prev => [...prev, { name, wattage: parseFloat(wattage), hours: parseFloat(hours), isOn: true }]);
//       setNewAppliance({ name: '', wattage: '', hours: '', isOn: true });
//       setCalculationError(null);
//     } else {
//       setCalculationError("Please enter valid appliance details (name, positive wattage, and hours).");
//     }
//   };

//   const removeAppliance = (index) => {
//     setAppliances(prev => prev.filter((_, i) => i !== index));
//     setCalculationError(null);
//   };

//   const toggleApplianceStatus = (index) => {
//     setAppliances(prev => prev.map((app, i) =>
//       i === index ? { ...app, isOn: !app.isOn } : app
//     ));
//   };

//   // Calculate consumption and cost monthly
//   const calculateMonthlyConsumptionAndCost = () => {
//     let totalDailyKWH = 0;
//     appliances.forEach(app => {
//       totalDailyKWH += (app.wattage * app.hours) / 1000;
//     });
//     const monthlyKWH = totalDailyKWH * 30;
//     const monthlyCost = monthlyKWH * electricityCostPerKWH;
//     return { monthlyKWH, monthlyCost };
//   };

//   // Calculate current hourly consumption and cost for appliances ON
//   const calculateInstantaneousConsumptionAndCost = () => {
//     let currentHourlyKWH = 0;
//     appliances.forEach(app => {
//       if (app.isOn) {
//         currentHourlyKWH += app.wattage / 1000;
//       }
//     });
//     const currentHourlyCost = currentHourlyKWH * electricityCostPerKWH;
//     return { currentHourlyKWH, currentHourlyCost };
//   };

//   const { monthlyKWH, monthlyCost } = calculateMonthlyConsumptionAndCost();
//   const { currentHourlyKWH, currentHourlyCost } = calculateInstantaneousConsumptionAndCost();

//   const saveAppliances = async () => {
//     if (!db || !userId) {
//       setSaveLoadStatus('Not signed in. Cannot save profile.');
//       return;
//     }
//     setIsSaving(true);
//     setSaveLoadStatus('Saving profile...');
//     try {
//       const userAppliancesRef = doc(db, `artifacts/${appId}/users/${userId}/appliances`, 'myAppliances');
//       await setDoc(userAppliancesRef, { list: JSON.stringify(appliances) });
//       setSaveLoadStatus('Profile saved successfully!');
//     } catch (e) {
//       setSaveLoadStatus('Error saving profile: ' + e.message);
//     } finally {
//       setIsSaving(false);
//       setTimeout(() => setSaveLoadStatus(''), 3000);
//     }
//   };

//   const generateAiTips = async () => {
//     setLoadingTips(true);
//     setAiTips([]);
//     const prompt = `Generate 5-7 concise, actionable, unique energy-saving tips for a household with common appliances.`;
//     try {
//       // Your AI integration here (e.g., calling Gemini or another AI service)
//       // For now, simulate tips:
//       setTimeout(() => {
//         setAiTips([
//           "Turn off lights when not in use.",
//           "Unplug chargers when not charging.",
//           "Use energy-efficient LED bulbs.",
//           "Run full loads in washing machines.",
//           "Set fridge temperature between 3-5°C."
//         ]);
//         setLoadingTips(false);
//       }, 1500);
//     } catch (e) {
//       setAiTips(["Failed to generate tips: " + e.message]);
//       setLoadingTips(false);
//     }
//   };

//   const handleSignOut = async () => {
//     if (auth) {
//       try {
//         await signOut(auth);
//         setShowLoginPage(false);
//       } catch (error) {
//         console.error("Error signing out:", error);
//       }
//     }
//   };

//   if (!isAuthReady) {
//     return (
//       <div className="loading-container">
//         <div className="loading-card">
//           <p className="loading-text">Loading...</p>
//           <p className="loading-subtext">Waiting for authentication.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="estimator-container">
//       <nav className="navbar">
//         <div className="navbar-brand">WattWise</div>
//         <button onClick={handleSignOut} className="navbar-button">Sign Out</button>
//       </nav>

//       <div className="estimator-card">
//         <h1 className="estimator-title">Electricity Usage Estimator</h1>

//         {userId && <p>Your User ID: <span className="user-id-value">{userId}</span></p>}

//         <section className="section-card">
//           <h2 className="section-title">Add an Appliance</h2>
//           <div className="appliance-input-grid">
//             <input
//               type="text"
//               name="name"
//               placeholder="Appliance Name (e.g., Fridge)"
//               value={newAppliance.name}
//               onChange={handleInputChange}
//               className="input-field"
//             />
//             <input
//               type="number"
//               name="wattage"
//               placeholder="Wattage (Watts)"
//               value={newAppliance.wattage}
//               onChange={handleInputChange}
//               min="0"
//               step="any"
//               className="input-field"
//             />
//             <input
//               type="number"
//               name="hours"
//               placeholder="Daily Hours Used"
//               value={newAppliance.hours}
//               onChange={handleInputChange}
//               min="0"
//               step="any"
//               className="input-field"
//             />
//           </div>
//           {calculationError && <p className="error-message">{calculationError}</p>}
//           <button onClick={addAppliance} className="button primary-button">Add Appliance</button>
//         </section>

//         <section className="section-card">
//           <h2 className="section-title">Your Appliances</h2>
//           {appliances.length === 0 ? (
//             <p className="empty-list-message">No appliances added yet.</p>
//           ) : (
//             <ul className="appliance-list">
//               {appliances.map((app, idx) => (
//                 <li key={idx} className="appliance-item">
//                   <div className="appliance-details">
//                     <p className="appliance-name">{app.name}</p>
//                     <p className="appliance-specs">
//                       {app.wattage}W for {app.hours} hours/day
//                       <span className={`appliance-status ${app.isOn ? 'status-on' : 'status-off'}`}>
//                         {app.isOn ? 'ON' : 'OFF'}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="appliance-actions">
//                     <button
//                       onClick={() => toggleApplianceStatus(idx)}
//                       className={`icon-button ${app.isOn ? 'button-red' : 'button-green'}`}
//                       aria-label={app.isOn ? "Turn off appliance" : "Turn on appliance"}
//                     >
//                       {app.isOn ? 'OFF' : 'ON'}
//                     </button>
//                     <button
//                       onClick={() => removeAppliance(idx)}
//                       className="icon-button button-red"
//                       aria-label="Remove appliance"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         <section className="section-card">
//           <h2 className="section-title">Settings & Profile</h2>
//           <label htmlFor="cost" className="cost-label">Cost per kWh ($):</label>
//           <input
//             id="cost"
//             type="number"
//             value={electricityCostPerKWH}
//             onChange={e => setElectricityCostPerKWH(parseFloat(e.target.value) || 0)}
//             min="0"
//             step="0.01"
//             className="input-field cost-input"
//           />
//           <button
//             onClick={saveAppliances}
//             disabled={!userId || isSaving}
//             className={`button green-button ${(!userId || isSaving) ? 'button-disabled' : ''}`}
//           >
//             {isSaving ? 'Saving...' : 'Save Profile'}
//           </button>
//           {saveLoadStatus && <p className="save-load-status">{saveLoadStatus}</p>}
//         </section>

//         <section className="usage-summary-card">
//           <h2 className="section-title text-center">Your Estimated Usage</h2>
//           <div className="usage-metrics-grid">
//             <div className="usage-metric-item green-metric">
//               <p className="metric-label">Monthly Consumption:</p>
//               <p className="metric-value">{monthlyKWH.toFixed(2)} kWh</p>
//             </div>
//             <div className="usage-metric-item green-metric">
//               <p className="metric-label">Estimated Monthly Cost:</p>
//               <p className="metric-value">${monthlyCost.toFixed(2)}</p>
//             </div>
//           </div>
//           <div className="usage-metrics-grid secondary-metrics-grid">
//             <div className="usage-metric-item purple-metric">
//               <p className="metric-label">Current Hourly Consumption (Active):</p>
//               <p className="metric-value">{currentHourlyKWH.toFixed(2)} kWh/hour</p>
//             </div>
//             <div className="usage-metric-item purple-metric">
//               <p className="metric-label">Current Hourly Cost (Active):</p>
//               <p className="metric-value">${currentHourlyCost.toFixed(2)}/hour</p>
//             </div>
//           </div>
//           <p className="note-text">
//             <span className="note-highlight">Note:</span> Current Hourly metrics show only appliances marked "ON".
//           </p>
//         </section>

//         <section className="section-card yellow-section">
//           <h2 className="section-title text-center">Energy-Saving Tips</h2>
//           <button
//             onClick={generateAiTips}
//             disabled={loadingTips}
//             className={`button orange-button ${loadingTips ? 'button-disabled' : ''}`}
//           >
//             {loadingTips ? 'Generating Tips...' : 'Get AI Energy Tips'}
//           </button>
//           <div className="ai-tips-container">
//             {aiTips.length > 0 && (
//               <ul className="ai-tips-list">
//                 {aiTips.map((tip, i) => <li key={i} className="ai-tip-item">{tip}</li>)}
//               </ul>
//             )}
//             {loadingTips && <p className="loading-tips-message">Thinking of smart tips...</p>}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default EstimatorPage;


import React, { useState, useEffect, useContext } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { AppContext } from './App';

const EstimatorPage = () => {
  const { db, auth, user, isAuthReady } = useContext(AppContext);
  const appId = 'default-app-id';

  const [appliances, setAppliances] = useState([]);
  const [newAppliance, setNewAppliance] = useState({ name: '', wattage: '', hours: '', isOn: true });
  const [electricityCostPerKWH, setElectricityCostPerKWH] = useState(0.15);
  const [aiTips, setAiTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const [calculationError, setCalculationError] = useState(null);
  const [saveLoadStatus, setSaveLoadStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const userId = user?.uid;

  useEffect(() => {
    if (db && userId && isAuthReady) {
      const userAppliancesRef = doc(db, `artifacts/${appId}/users/${userId}/appliances`, 'myAppliances');
      const unsubscribe = onSnapshot(
        userAppliancesRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.list) {
              try {
                const loadedAppliances = JSON.parse(data.list);
                const appliancesWithToggle = loadedAppliances.map((app) => ({
                  ...app,
                  isOn: typeof app.isOn === 'boolean' ? app.isOn : true
                }));
                setAppliances(appliancesWithToggle);
                setSaveLoadStatus('Profiles loaded!');
              } catch (e) {
                setSaveLoadStatus('Error loading profile data.');
                setAppliances([]);
              }
            }
          } else {
            setSaveLoadStatus('No saved profile found.');
            setAppliances([]);
          }
        },
        (error) => {
          setSaveLoadStatus('Error loading profile: ' + error.message);
        }
      );

      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady, appId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppliance((prev) => ({ ...prev, [name]: value }));
  };

  const addAppliance = () => {
    const { name, wattage, hours } = newAppliance;
    if (name && wattage > 0 && hours > 0) {
      setAppliances((prev) => [...prev, { name, wattage: parseFloat(wattage), hours: parseFloat(hours), isOn: true }]);
      setNewAppliance({ name: '', wattage: '', hours: '', isOn: true });
      setCalculationError(null);
    } else {
      setCalculationError('Please enter valid appliance details (name, positive wattage, and hours).');
    }
  };

  const removeAppliance = (index) => {
    setAppliances((prev) => prev.filter((_, i) => i !== index));
    setCalculationError(null);
  };

  const toggleApplianceStatus = (index) => {
    setAppliances((prev) =>
      prev.map((app, i) => (i === index ? { ...app, isOn: !app.isOn } : app))
    );
  };

  const calculateMonthlyConsumptionAndCost = () => {
    let totalDailyKWH = 0;
    appliances.forEach((app) => {
      totalDailyKWH += (app.wattage * app.hours) / 1000;
    });
    const monthlyKWH = totalDailyKWH * 30;
    const monthlyCost = monthlyKWH * electricityCostPerKWH;
    return { monthlyKWH, monthlyCost };
  };

  const calculateInstantaneousConsumptionAndCost = () => {
    let currentHourlyKWH = 0;
    appliances.forEach((app) => {
      if (app.isOn) {
        currentHourlyKWH += app.wattage / 1000;
      }
    });
    const currentHourlyCost = currentHourlyKWH * electricityCostPerKWH;
    return { currentHourlyKWH, currentHourlyCost };
  };

  const { monthlyKWH, monthlyCost } = calculateMonthlyConsumptionAndCost();
  const { currentHourlyKWH, currentHourlyCost } = calculateInstantaneousConsumptionAndCost();

  const saveAppliances = async () => {
    if (!db || !userId) {
      setSaveLoadStatus('Not signed in. Cannot save profile.');
      return;
    }
    setIsSaving(true);
    setSaveLoadStatus('Saving profile...');
    try {
      const userAppliancesRef = doc(db, `artifacts/${appId}/users/${userId}/appliances`, 'myAppliances');
      await setDoc(userAppliancesRef, { list: JSON.stringify(appliances) });
      setSaveLoadStatus('Profile saved successfully!');
    } catch (e) {
      setSaveLoadStatus('Error saving profile: ' + e.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveLoadStatus(''), 3000);
    }
  };

  const generateAiTips = async () => {
    setLoadingTips(true);
    setAiTips([]);
    const prompt = `Generate 5-7 concise, actionable, unique energy-saving tips for a household with common appliances.`;
    try {
      // Simulated AI tips for demo
      setTimeout(() => {
        setAiTips([
          'Turn off lights when not in use.',
          'Unplug chargers when not charging.',
          'Use energy-efficient LED bulbs.',
          'Run full loads in washing machines.',
          'Set fridge temperature between 3-5°C.'
        ]);
        setLoadingTips(false);
      }, 1500);
    } catch (e) {
      setAiTips(['Failed to generate tips: ' + e.message]);
      setLoadingTips(false);
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  if (!isAuthReady) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <p className="loading-text">Loading...</p>
          <p className="loading-subtext">Waiting for authentication.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Auth state changed, no user logged in => you can render nothing or a message
    return <p>Unauthorized. Please log in again.</p>;
  }

  return (
    <div className="estimator-container">
      <nav className="navbar">
        <div className="navbar-brand">WattWise</div>
        <button onClick={handleSignOut} className="navbar-button">
          Sign Out
        </button>
      </nav>

      <div className="estimator-card">
        <h1 className="estimator-title">Electricity Usage Estimator</h1>

        <p>
          Your User ID: <span className="user-id-value">{userId}</span>
        </p>

        {/* Add Appliance Section */}
        <section className="section-card">
          <h2 className="section-title">Add an Appliance</h2>
          <div className="appliance-input-grid">
            <input
              type="text"
              name="name"
              placeholder="Appliance Name (e.g., Fridge)"
              value={newAppliance.name}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="number"
              name="wattage"
              placeholder="Wattage (Watts)"
              value={newAppliance.wattage}
              onChange={handleInputChange}
              min="0"
              step="any"
              className="input-field"
            />
            <input
              type="number"
              name="hours"
              placeholder="Daily Hours Used"
              value={newAppliance.hours}
              onChange={handleInputChange}
              min="0"
              step="any"
              className="input-field"
            />
          </div>
          {calculationError && <p className="error-message">{calculationError}</p>}
          <button onClick={addAppliance} className="button primary-button">
            Add Appliance
          </button>
        </section>

        {/* Appliances List Section */}
        <section className="section-card">
          <h2 className="section-title">Your Appliances</h2>
          {appliances.length === 0 ? (
            <p className="empty-list-message">No appliances added yet.</p>
          ) : (
            <ul className="appliance-list">
              {appliances.map((app, idx) => (
                <li key={idx} className="appliance-item">
                  <div className="appliance-details">
                    <p className="appliance-name">{app.name}</p>
                    <p className="appliance-specs">
                      {app.wattage}W for {app.hours} hours/day
                      <span className={`appliance-status ${app.isOn ? 'status-on' : 'status-off'}`}>
                        {app.isOn ? 'ON' : 'OFF'}
                      </span>
                    </p>
                  </div>
                  <div className="appliance-actions">
                    <button
                      onClick={() => toggleApplianceStatus(idx)}
                      className={`icon-button ${app.isOn ? 'button-red' : 'button-green'}`}
                      aria-label={app.isOn ? 'Turn off appliance' : 'Turn on appliance'}
                    >
                      {app.isOn ? 'OFF' : 'ON'}
                    </button>
                    <button
                      onClick={() => removeAppliance(idx)}
                      className="icon-button button-red"
                      aria-label="Remove appliance"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Settings and Profile */}
        <section className="section-card">
          <h2 className="section-title">Settings & Profile</h2>
          <label htmlFor="cost" className="cost-label">
            Cost per kWh ($):
          </label>
          <input
            id="cost"
            type="number"
            value={electricityCostPerKWH}
            onChange={(e) => setElectricityCostPerKWH(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="input-field cost-input"
          />
          <button
            onClick={saveAppliances}
            disabled={!userId || isSaving}
            className={`button green-button ${!userId || isSaving ? 'button-disabled' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
          {saveLoadStatus && <p className="save-load-status">{saveLoadStatus}</p>}
        </section>

        {/* Usage Summary */}
        <section className="usage-summary-card">
          <h2 className="section-title text-center">Your Estimated Usage</h2>
          <div className="usage-metrics-grid">
            <div className="usage-metric-item green-metric">
              <p className="metric-label">Monthly Consumption:</p>
              <p className="metric-value">{monthlyKWH.toFixed(2)} kWh</p>
            </div>
            <div className="usage-metric-item green-metric">
              <p className="metric-label">Estimated Monthly Cost:</p>
              <p className="metric-value">${monthlyCost.toFixed(2)}</p>
            </div>
          </div>
          <div className="usage-metrics-grid secondary-metrics-grid">
            <div className="usage-metric-item purple-metric">
              <p className="metric-label">Current Hourly Consumption (Active):</p>
              <p className="metric-value">{currentHourlyKWH.toFixed(2)} kWh/hour</p>
            </div>
            <div className="usage-metric-item purple-metric">
              <p className="metric-label">Current Hourly Cost (Active):</p>
              <p className="metric-value">${currentHourlyCost.toFixed(2)}/hour</p>
            </div>
          </div>
          <p className="note-text">
            <span className="note-highlight">Note:</span> Current Hourly metrics show only appliances marked "ON".
          </p>
        </section>

        {/* AI Energy Tips */}
        <section className="section-card yellow-section">
          <h2 className="section-title text-center">Energy-Saving Tips</h2>
          <button
            onClick={generateAiTips}
            disabled={loadingTips}
            className={`button orange-button ${loadingTips ? 'button-disabled' : ''}`}
          >
            {loadingTips ? 'Generating Tips...' : 'Get AI Energy Tips'}
          </button>
          <div className="ai-tips-container">
            {aiTips.length > 0 && (
              <ul className="ai-tips-list">
                {aiTips.map((tip, i) => (
                  <li key={i} className="ai-tip-item">
                    {tip}
                  </li>
                ))}
              </ul>
            )}
            {loadingTips && <p className="loading-tips-message">Thinking of smart tips...</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EstimatorPage;
