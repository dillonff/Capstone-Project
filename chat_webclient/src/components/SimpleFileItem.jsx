import React from 'react';

export default function SimpleFileItem({file}) {
  return <div style={{width: '300px', minHeight: '50px', padding: '15px', backgroundColor: '#f0f0f0'}}>
    <h5 style={{overflow: 'hidden'}}>{file.filename}</h5>
    <a target="_blank" href={"http://127.0.0.1:11451/api/v1/files/" + file.id + "/" + encodeURIComponent(file.filename)}>Download</a>
  </div>
}
