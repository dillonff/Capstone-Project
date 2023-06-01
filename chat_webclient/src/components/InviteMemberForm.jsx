import { Button, TextField } from '@mui/material';
import React from 'react';


export function InviteMemberForm({
  onInvite
}) {
	const formRef = React.useRef();
	const submit = (event) => {
		event.preventDefault();
		if (onInvite) {
			let d = new FormData(formRef.current);
			if (onInvite) {
				onInvite(d.get('email'));
			}
		}
	}
	return <form ref={formRef} onSubmit={submit}>
		<TextField
      fullWidth
      name="email"
      required
      label="Email"
      helperText="someone@example.com"
      variant="standard"
    />
		<div>
		<Button
			variant="outlined"
			type="submit"
		>
			Invite
		</Button>
		</div>
	</form>
}
