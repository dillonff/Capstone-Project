
function SimpleMessage({
    message
}) {
    const time = new Date(message.timeCreated).toLocaleString();
    return <div key={message.id} style={{padding: '5px'}}>
        <label>
            <div style={{display: 'inline', fontWeight: 'bold'}}>{message.sender.username}</div>  - {time}
        </label>
        <div style={{fontSize: 'x-large'}}>{message.content}</div>
    </div>
}

export default SimpleMessage;
