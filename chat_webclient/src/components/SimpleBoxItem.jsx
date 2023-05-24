import TagIcon from '@mui/icons-material/Tag';
import GroupIcon from '@mui/icons-material/Group';

function SimpleBoxItem(props) {
  return (
    <div
      className={
        // `workspace__wrapper--${props.classNamePrefix}` + (props.selected ? ` ${props.classNamePrefix}__wrapper__selected` : '')
        props.selected
          ? 'workspace__wrapper__selected'
          : `workspace__wrapper--${props.classNamePrefix}`
      }
      key={props.key}
      onClick={props.onClick}
    >
      <div>
        <div>
          <TagIcon className="sidebar__icon" />
          {props.title}
        </div>
        <div>
          <GroupIcon className="sidebar__icon" />
          {props.text}
        </div>
      </div>
    </div>
  );
}

export default SimpleBoxItem;
