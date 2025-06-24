import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react';

const ChatSidebar = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
    const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const url = search
        ? `/api/users?search=${search}`
        : `/api/users`; // fetch all if no search

      const res = await axios.get(url, config);
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users", err);
    }
  };

  fetchUsers(); // call on initial mount + when search changes
}, [search]); // this works perfectly


  return (
    <div className='p-4'>
      <input type='text'
      placeholder='Search users..'
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      />

      {users.map((user) => (
        <div key={user._id} className="p-2 border-b cursor-pointer">
          {user.name}
        </div>
      ))}
    </div>
  )
}

export default ChatSidebar
