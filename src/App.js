import React, { useState, useEffect } from "react";

import './App.css';
import Post from './Post';
import { db } from './firebase';

function App() {
  
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('post').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post: doc.data(),
      })));
    })
  }, [])

  return (
    <div className="App">
      <div className="app__header">
      <img 
        className="app__headerImage"
        alt="noimage"
        src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-new-circle-512.png"
      />
      </div>

      {
        posts.map(({ id, post}) => (<Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />))
      }

    </div>
  );
}

export default App;
