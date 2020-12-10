import React, { useState }  from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption , setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
            setProgress(progress);
            },
            (error) => {
                // error function .......
                alert(error.message);
            },
            () => {
                storage.ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    setUrl(url);
                    db.collection('post').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })
                    setProgress(0);
                    setImage(null);
                    setUrl('')
                    setCaption('')
                })
            }
        )
    };
    
    return(
        <div className="imageUpload" >

            <div className="Imageupload__yourstatus">
            <input type="text"
            className="Imageupload_caption" 
            placeholder="What's on your mind ?" 
            onChange={event => setCaption(event.target.value)}
            value={caption} />
            <label className="Imageupload__select" for="upload_file"> +
                <input type="file" id="upload_file" hidden onChange={handleChange}/>
            </label>
            <button focusVisible className="Imageupload__upload" onClick={handleUpload}>
                Post
            </button>
            </div>

            { progress !== 0 ? (<progress className="Imageupload__progress" value={progress} max="100" ></progress>)
                            : ('')}
        </div>
    )
}

export default ImageUpload