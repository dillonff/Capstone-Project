function SimpleMemberList({members}) {
  const renderMembers = (members) => {
    let elems = [];
    if (members.length > 0) {
      elems.push(
        <div key="0" style={{ marginTop: '3px' }}>
          Members
        </div>
      );
    }
    for (const member of members) {
      let elem = (
        <div key={member.id} style={{ margin: '3px' }}>
          {member.username} ({member.id})
        </div>
      );
      elems.push(elem);
    }
    return elems;
  };

  const elems = renderMembers(members);

  return <div>{elems}</div>;

}

export default SimpleMemberList;

