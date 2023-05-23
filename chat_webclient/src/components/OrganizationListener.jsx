import React from 'react';
import Event from '../event';
import {
  useMountedEffect
} from '../util';

import {
  OrganizationsContext
} from '../AppContext';

import {
  getOrgs
} from '../api';

export default function OrganizationListener({}) {
  const [orgs, setOrgs] = React.useContext(OrganizationsContext);

  useMountedEffect(getMounted => {
    getOrgs().then(res => {
      if (getMounted()) {
        setOrgs(res);
      }
    });

    let cb = Event.getDefaultCallback();
    cb.onInfoChanged = data => {
      if (data.infoType.startsWith('organization')) {
        console.error('Org changed');
        getOrgs().then(res => {
          if (getMounted()) {
            setOrgs(res);
          }
        });
      }
    }
    Event.addListener(cb);
    return _ => {
      Event.removeListener(cb);
    }
  }, []);

  return <></>
}