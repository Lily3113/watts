// import React, { useState } from 'react';

// const Profile = () => {
//   const [profile, setProfile] = useState({
//     name: '',
//     email: '',
//     appliances: [],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile({ ...profile, [name]: value });
//   };

//   const handleSave = () => {
//     localStorage.setItem('userProfile', JSON.stringify(profile));
//     alert('Profile saved!');
//   };

//   return (
//     <div className="profile-container">
//       <h2>Your Profile</h2>
//       <input
//         type="text"
//         name="name"
//         placeholder="Name"
//         value={profile.name}
//         onChange={handleChange}
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={profile.email}
//         onChange={handleChange}
//       />
//       <button onClick={handleSave}>Save Profile</button>
//     </div>
//   );
// };

// export default Profile;
