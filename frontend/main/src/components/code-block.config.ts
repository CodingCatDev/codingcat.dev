export const codeBlockConfig = {
  name: 'Code Block',
  defaultStyles: {
    paddingLeft: '20px',
    borderRadius: '5px',
    overflow: 'clip',
  },
  inputs: [
    {
      name: 'code',
      type: 'longText',
      defaultValue: 'const incr = num => num + 1',
    },
    {
      name: 'language',
      type: 'string',
      defaultValue: 'javascript',
    },
    {
      name: 'dark',
      type: 'boolean',
      defaultValue: false,
    },
  ],
};
