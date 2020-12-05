import { Button } from '@material-ui/core';
import React  from 'react';

function handleChange() {

}

function handleUpload() {
    
}

function ImageUpload() {
    return(
        <div>
            {/* Cation Input */}
            {/* File Pickup */}
            {/* Post Button */}
            <h2> Upload File </h2>
            <input type="text"/>
            <input type="file" onChange={handleChange}/>
            <Button class="Imageupload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload