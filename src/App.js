import './App.css';
import React, { useState, useEffect } from "react";
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from "@material-ui/core";

import Post from './Post';
import ImageUpload from './ImageUpload';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn]= useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // User has logged IN 
        console.log('User >', authUser);
        if(authUser.displayName) {
          // don't update their username
        } else {
          return authUser.updateProfile({
            displayName:username
          })
        }
        setUser(authUser)
      } else {
        // User has logged OUT
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user,username])

  useEffect(() => {
    db.collection('post').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post: doc.data(),
      })));
    })
  }, [])

  const signup = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => { 
      setUser(authUser);
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => {
      setUser(null);
      alert(error.message)
    })

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .then((user) => { console.log('User logged In', user) })
    .catch((error) => alert(error.message))
    setOpenSignIn(false);
  }

  return (
    <div className="App">        
        {/* Sign up Modal */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}>
          <div  style={modalStyle} className={classes.paper}>
            <form className='app__signup'>
            <center>
            <img 
              className="app__signupImageLogo"
              alt="Instagram_logo"
              src="https://play-lh.googleusercontent.com/9ASiwrVdio0I2i2Sd1UzRczyL81piJoKfKKBoC8PUm2q6565NMQwUJCuNGwH-enhm00"
            />        
            </center>
            
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}  
            />
            
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  
            />

            <Button type="submit" onClick={signup}> Signup </Button>
            </form>
          </div>
        </Modal>

        {/* Login Modal */}

        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}>
          <div  style={modalStyle} className={classes.paper}>
            <form className='app__signup'>
            <center>
            <img 
              className="app__signupImageLogo"
              alt="Instagram_logo"
              src="https://play-lh.googleusercontent.com/9ASiwrVdio0I2i2Sd1UzRczyL81piJoKfKKBoC8PUm2q6565NMQwUJCuNGwH-enhm00"
            />        
            </center>
            
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  
            />

            <Button type="submit" onClick={signIn}> Login </Button>
            </form>
          </div>
        </Modal>

    <div className="app__header">
      <img 
        className="app__headerImage"
        alt="noimage"
        src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-new-circle-512.png"
      />

      { user? ( <Button onClick={() => auth.signOut()} > Logout </Button> ) 
            : ( 
         <div className="app__loginContainer">
           <Button onClick={() => setOpenSignIn(true)} > Login </Button>
           <Button onClick={() => setOpen(true)} > Signup </Button>
         </div>
       ) 
      }
    </div>
      
      { posts.map(({ id, post}) => (<Post 
      key={id} 
      postId={id} 
      username={post.username} 
      caption={post.caption} 
      imageUrl={post.imageUrl} 
      user={user}
      />))
      }

      { user? ( <ImageUpload username={user.displayName} /> ) 
            : ( <h4> Login to upload </h4> )
      } 

    </div>
  );
}

export default App;
