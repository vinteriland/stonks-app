import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const { data } = await supabase.from('profiles').select('*');
      setChannels(data);
    };
    fetchChannels();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1>Channels</h1>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link href={`/channel/${channel.id}`}>
              <a>{channel.username}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
