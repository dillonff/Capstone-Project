import React from 'react';
import { API_ENDPOINT } from '../api';

function getFileLink(file) {
  return API_ENDPOINT + "/files/" + file.id + "/" + encodeURIComponent(file.filename);
}

function isImage(file) {
  return file.filename.match(/\.(jpg|jpeg|png|gif)$/i);
}

export default function SimpleFileItem({file}) {
  return <div style={{width: '300px', minHeight: '50px', padding: '10px', backgroundColor: '#f0f0f0', marginRight: '5px'}}>
    <div style={{overflowWrap: 'break-word'}}>{file.filename}</div>
    {isImage(file) && <div>
      <img style={{maxHeight: '200px', maxWidth: '500px'}} src={getFileLink(file)} />
    </div>}
    <a target="_blank" href={getFileLink(file)}>Download</a>
  </div>
}
