import './Post.css';

import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import { Button, Input } from "@material-ui/core";
import firebase from 'firebase';


function Post({ postId, username, caption, imageUrl, user}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
            .collection("post")
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map(doc => doc.data()))
            });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        
        console.log('user ', user)
        
        db.collection('post')
        .doc(postId)
        .collection('comments')
        .add({
            text:comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setComment('');
    }

    return (
        <div className="post" >
            <div 
            className="post__header"
            >   
            <Avatar
            className="post__avatar"
            alt="cleverpro"
            src="/static/images/avatar/1.png"
            />
            <h3> {username} </h3>
            </div>
            {/* header -> Avatar -> Username */}

            <img 
            className="post__image"
            src={imageUrl}
            alt="No Img"
            />
            
            <h4 className="post__text"> <strong> {username} </strong> : {caption} </h4>

            {/* Comment Section */}

            <div className="Post__commentsSection">
                { comments.map((comment) => (
                    <p>
                        <strong> {comment.username} </strong> {comment.text}
                    </p>
                ))}
            </div>
            { user && (      
                <form className="Post__commentbox">
                    <input
                        className="Post__commentInput"
                        type="text"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        disabled={!comment}
                        className="Post__button"
                        type="submit"
                        onClick={postComment}
                    >   
                        Post
                    </Button>
                </form>
                )}
            


        
        </div>
    )
}

export default Post
