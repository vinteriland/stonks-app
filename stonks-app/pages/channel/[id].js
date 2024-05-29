import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Channel() {
  const router = useRouter();
  const { id } = router.query;
  const [channel, setChannel] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchChannel = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
      setChannel(data);
    };
    if (id) fetchChannel();
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').eq('channel_id', id);
      setMessages(data);
    };
    if (id) fetchMessages();
  }, [id]);

    

  const followChannel = async () => {
    const user = supabase.auth.getUser();
    if (!user) {
      // Redirect or prompt login
      router.push('/auth');
      return;
    }
    // await supabase.from('followers').insert({ user_id: user.id, channel_id: id });
    await supabase.from('followers').insert({ user_id: user.id });
  };

  const sendMessage = async () => {
    const user = supabase.auth.getUser();
    if (user) {
      await supabase.from('messages').insert({ channel_id: id, user_id: user.id, content: message });
      setMessage('');
    } else {
      router.push('/auth');
    }
  };

  const notifyFollowers = async () => {
    const { data: followers } = await supabase
      .from('followers')
      .select('user_id')
      .eq('channel_id', id);
    for (let follower of followers) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', follower.user_id)
        .single();
      await fetch('/api/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profile.email,
          message: `${channel.username} has started streaming!`,
        }),
      });
    }
  };
  
  const startStream = () => {
    setIsStreaming(true);
    notifyFollowers();
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
          <button onClick={followChannel}>Follow</button>
          <div>
            {messages.map((msg) => (
              <p key={msg.id}>{msg.content}</p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
