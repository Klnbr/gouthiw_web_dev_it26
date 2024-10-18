import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';

function Jodit() {
     const [html, setHtml] = useState('my <b>HTML</b>');

     const onChange = (e) => {
          setHtml(e.target.value);
     };
     return (
          <Editor value={html} onChange={onChange} />
     )
}

export default Jodit