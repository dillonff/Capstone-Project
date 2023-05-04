
function SimpleMessage({
    message
}) {
    const time = new Date(message.timeCreated).toLocaleString();
    return <div style={{padding: '5px'}}>
        <label>{message.sender.username}  - {time}</label>
        <div style={{fontSize: 'x-large'}}>{message.content}</div>
    </div>
}

export default SimpleMessage;
