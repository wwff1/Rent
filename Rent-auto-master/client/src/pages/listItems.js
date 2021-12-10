import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import ErrorIcon from '@material-ui/icons/Error';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import PolymerIcon from '@material-ui/icons/Polymer';
import SpaIcon from '@material-ui/icons/Spa';
import Link from "@material-ui/core/Link";

export const mainListItems = (
  <div>
    <ListItem button component="a" href="/orderPage" to="/orderPage">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Заказы" />
    </ListItem>
  <ListItem button component="a" href="/clientPage" to="/clientPage">
      <ListItemIcon>
          <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Клиенты" />
  </ListItem>
    <ListItem button component="a" href="/autoPage" to="/autoPage">
      <ListItemIcon>
        <DirectionsCarIcon />
      </ListItemIcon>
      <ListItemText primary="Автомобили" />
    </ListItem>
    <ListItem button component="a" href="/markPage" to="/markPage">
      <ListItemIcon>
        <PolymerIcon />
      </ListItemIcon>
      <ListItemText primary="Марки автомобилей" />
    </ListItem>
    <ListItem button component="a" href="/modelPage" to="/modelPage">
      <ListItemIcon>
        <SpaIcon />
      </ListItemIcon>
      <ListItemText primary="Модели автомобилей" />
    </ListItem>
    <ListItem button component="a" href="/parkPage" to="/parkPage">
      <ListItemIcon>
        <EmojiTransportationIcon />
      </ListItemIcon>
      <ListItemText primary="Парки" />
    </ListItem>
  <ListItem button component="a" href="/accidentPage" to="/accidentPage">
      <ListItemIcon>
          <ErrorIcon />
      </ListItemIcon>
      <ListItemText primary="Происшествия" />
  </ListItem>
  <ListItem button component="a" href="/typePage" to="/typePage">
      <ListItemIcon>
          <AirportShuttleIcon />
      </ListItemIcon>
      <ListItemText primary="Тип кузова" />
  </ListItem>
  <ListItem button component="a" href="/classPage" to="/classPage">
      <ListItemIcon>
          <TrendingUpIcon />
      </ListItemIcon>
      <ListItemText primary="Класс автомобилей" />
  </ListItem>
  </div>
);
