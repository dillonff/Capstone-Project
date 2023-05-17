import { Icon } from '@mui/material';

function SimpleBoxItem(props) {
  let border = '1px solid black';
  if (props.selected) {
    border = '2px solid red';
  }
  return (
    <div
      className={
        props.selected ? 'workspace__wrapper__selected' : 'workspace__wrapper'
      }
      key={props.key}
      onClick={props.onClick}
    >
      <div>
        {Icon && <Icon Icon className="Sidebar__icon" />}
        <div style={{ fontWeight: 'bold' }}>{props.title}</div>
        <div>{props.text}</div>
      </div>
    </div>
  );
}

export default SimpleBoxItem;
