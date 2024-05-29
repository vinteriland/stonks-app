import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const [profile, setProfile] = useState({ username: '', notifications: false });

  useEffect(() => {
    const getProfile = async () => {
      const user = supabase.auth.user();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);
      }
    };
    getProfile();
  }, []);

  const updateProfile = async () => {
    const user = supabase.auth.user();
    await supabase.from('profiles').upsert({ id: user.id, ...profile });
  };

  return (
    <div className="container mx-auto p-4">
      <h1>Complete Your Profile</h1>
      <input
        type="text"
        placeholder="Username"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      <label>
        <input
          type="checkbox"
          checked={profile.notifications}
          onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
        />
        Enable Notifications
      </label>
      <button onClick={updateProfile}>Save Profile</button>
    </div>
  );
}
