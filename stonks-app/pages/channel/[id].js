import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Channel() {
  const router = useRouter();
  const { id } = router.query;
  const [channel, setChannel] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const fetchChannel = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
      setChannel(data);
    };
    if (id) fetchChannel();
  }, [id]);

  const startStream = () => {
    setIsStreaming(true);
  };

  return (
    <div className="container mx-auto p-4">
      {channel ? (
        <>
          <h1>{channel.username}</h1>
          <button onClick={startStream}>Start Streaming</button>
          {isStreaming && (
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
