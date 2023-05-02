'use strict';

function SimpleBoxItem(props) {
  let border = '1px solid black';
  if (props.selected) {
    border = '2px solid red';
  }
  return <div
    key={props.key}
    style={{
      padding: '5px',
      margin: '5px',
      border: border,
      cursor: 'pointer',
    }}
    onClick={props.onClick}
  >
    <div>{props.title}</div>
    <div>{props.text}</div>
  </div>;
}
