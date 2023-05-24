import React from 'react';

import {
  callApiJsonChecked
} from '../api';

export default function FileUploadForm({inputRef, onFileUploaded}) {

  return <form method="post" enctype="multipart/form-data" onSubmit={e => {
    e.preventDefault();
    let data = new FormData(e.target);
    callApiJsonChecked('/files', 'POST', data).then(res => {
      onFileUploaded(res);
    }).catch(e => {
      console.error(e);
      alert(e)
    });
    return false;
  }}>
    <div>
      <input type="file" ref={inputRef} name="file" multiple onChange={e => {
        const form = e.target.form;
        if (e.target.files.length > 0) {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }} />
    </div>
    <div>
      <button>Submit</button>
    </div>
  </form>
}

