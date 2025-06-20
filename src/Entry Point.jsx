// import React, { useState } from "react";
// import "./App.css";

// const applianceData = {
//   Fridge: 150,  // watts
//   TV: 100,
//   Fan: 75,
//   Microwave: 1200,
//   Laptop: 60,
//   Bulb: 15,
// };

// function Estimator() {
//   const [appliance, setAppliance] = useState("Fridge");
//   const [hoursPerDay, setHoursPerDay] = useState("");
//   const [usageList, setUsageList] = useState([]);

//   const addAppliance = () => {
//     if (!hoursPerDay) return alert("Enter usage hours");

//     const watt = applianceData[appliance];
//     const monthlyKWh = ((watt * hoursPerDay * 30) / 1000).toFixed(2);
//     const cost = (monthlyKWh * 0.15).toFixed(2); // $0.15 per kWh

//     setUsageList([...usageList, { appliance, hoursPerDay, monthlyKWh, cost }]);
//     setHoursPerDay("");
//   };

//   const energyTips = [
//     "Turn off lights when not in use.",
//     "Unplug devices when not needed.",
//     "Use energy-efficient bulbs.",
//     "Limit appliance usage during peak hours.",
//     "Use cold water when washing clothes.",
//   ];

//   return (
//     <div className="estimator-container">
//       <h2>Electricity Usage Estimator</h2>
//       <div className="input-section">
//         <select value={appliance} onChange={(e) => setAppliance(e.target.value)}>
//           {Object.keys(applianceData).map((app) => (
//             <option key={app} value={app}>{app}</option>
//           ))}
//         </select>
//         <input
//           type="number"
//           placeholder="Hours per day"
//           value={hoursPerDay}
//           onChange={(e) => setHoursPerDay(e.target.value)}
//         />
//         <button onClick={addAppliance}>Add</button>
//       </div>

//       <div className="results">
//         <h3>Monthly Usage</h3>
//         <ul>
//           {usageList.map((item, index) => (
//             <li key={index}>
//               {item.appliance}: {item.monthlyKWh} kWh – Cost: ${item.cost}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="tips">
//         <h3>Energy-Saving Tips</h3>
//         <ul>
//           {energyTips.map((tip, index) => (
//             <li key={index}>💡 {tip}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Estimator;


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './styles.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
