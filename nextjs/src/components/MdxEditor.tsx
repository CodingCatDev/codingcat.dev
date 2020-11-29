// Import React dependencies.
import { useCallback, useEffect, useMemo, useState } from 'react';

import { createEditor, Editor, Transforms, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const MdxEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  // Use our deserializing function to read the data from Local Storage.
  const [value, setValue] = useState(
    localStorage.getItem('content') != null
      ? deserialize(localStorage.getItem('content'))
      : deserialize('')
  );

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value);
        // Serialize the value and save the string value to Local Storage.
        localStorage.setItem('content', serialize(value));
      }}
    >
      <Editable />
    </Slate>
  );
};

export default MdxEditor;
// Define a serializing function that takes a value and returns a string.
const serialize = (value) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map((n) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  );
};

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string) => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};
