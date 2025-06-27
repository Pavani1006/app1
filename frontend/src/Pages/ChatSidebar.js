import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react';

const ChatSidebar = ({ setSelectedUser }) => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

const handleUserClick = (user) => {
  setSelectedUser(user);
};

    // 👇 Run once to insert static users (only for dev)
useEffect(() => {
  const seedStaticUsers = async () => {
    try {
      await axios.get("http://localhost:5000/api/user/seed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Static users seeded");
    } catch (err) {
      console.log("Seeding error", err);
    }
  };

  seedStaticUsers();
}, []);

// 👇 Run whenever 'search' changes to fetch users
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const url = search
        ? `http://localhost:5000/api/user/all?search=${search}`
        : `http://localhost:5000/api/user/all`;

      const res = await axios.get(url, config);
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users", err);
    }
  };

  fetchUsers();
}, [search]);



  return (
    <div className='p-4'>
      <input type='text'
      placeholder='Search users..'
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      />

      {/* Scrollable user list */}
  <div className="overflow-y-auto max-h-60 border rounded bg-gray-50">
    {users.map((user) => (
      <div
        key={user._id}
        className="p-2 border-b cursor-pointer hover:bg-gray-200"
        onClick={() => handleUserClick(user)}
      >
        {user.name}
      </div>
    ))}
  </div>

  

    </div>
  )
}

export default ChatSidebar;
