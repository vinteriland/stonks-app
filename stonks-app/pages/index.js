import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';
import { useTranslation } from 'react-i18next';


export default function Home() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const { data } = await supabase.from('profiles').select('*');
      setChannels(data);
    };
    fetchChannels();
    
  }, []);
  const { t } = useTranslation('common');
  return (
    <div className="container mx-auto p-4">
      <h1>{t('Channels')}</h1>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link href={`/channel/${channel.id}`} passHref>
              {channel.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
