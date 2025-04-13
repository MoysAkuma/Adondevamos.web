import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const getFacilityCatalog = await axios.get('http://localhost/Facilities', {
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer your-token-here' // Add if needed
  }
});

export default function FacilitiesManagment({FacilityList}) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [FacilityCat, setFacilityCat] =  useState(null);
  const FacilityListUI = [];

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  FacilityList.forEach( facility => {
    FacilityListUI.push(
    <ListItem>
        <ListItemIcon>
          <BluetoothIcon />
        </ListItemIcon>
        <ListItemText id="switch-list" primary="facility.name" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={handleToggle('facility.name')}
            checked={checked.indexOf('facility.name') !== -1}
            inputProps={{ 'aria-labelledby': 'switch-list' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      )
  });

  useEffect(() => {
          const confirmEmail = async () => {
            const url ="http://localhost:3000/Facility";
            try {
              const resp = await axios.get(url);
              setArrMostVotedPlaces(resp.Info);
              console.log(resp);
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          };
          confirmEmail();
        }, []);
      if (loading) return <div>Loading most voted places...</div>;
      if (error) return <div>Error: {error}</div>;

  return (
    <List subheader={<ListSubheader>Itinerary</ListSubheader>} className={classes.root}>
      {FacilityListUI}
    </List>
  );
}

