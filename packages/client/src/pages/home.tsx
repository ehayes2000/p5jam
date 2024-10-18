import { useState, useEffect } from 'react';
import NewJam from '../components/CreateJam';
import JoinJam from '../components/JoinJam';
import FeaturedPost from '../components/featuredPost';
import { client, TPost } from '../client';
import { useContext } from 'react';
import { PopupContext } from '../state';

export default function Home() {
  const { popup, setPopup } = useContext(PopupContext);
  const [featuredPost, setFeaturedPost] = useState<TPost | null>();

  useEffect(() => {
    client.api.posts.featured.get().then((response) => {
      if (response.data) setFeaturedPost(response.data);
    });
  }, []);

  return (
    <div className="-z-50 flex h-full w-full items-center justify-center">
      {!featuredPost || (
        <div className="absolute left-0 top-0 -z-0 h-screen w-screen">
          <FeaturedPost post={featuredPost} />
        </div>
      )}
      {popup === 'create' ? (
        <div className="z-50">
          <NewJam closeCallback={() => setPopup('closed')} />
        </div>
      ) : (
        <></>
      )}
      {popup === 'join' ? (
        <div className="z-50">
          <JoinJam closeCallback={() => setPopup('closed')} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
