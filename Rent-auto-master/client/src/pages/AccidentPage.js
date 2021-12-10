import React, {useContext, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems} from './listItems';
import Button from "@material-ui/core/Button";
import {AuthContext} from "../context/AuthContext";
import {InputLabel, MenuItem, TextField} from "@material-ui/core";
import Title from "./Title";
import {useHttp} from "../hooks/http.hook";
import StickyFooter from "./Footer";
import {Autocomplete} from "@material-ui/lab";
import moment from 'moment';
import * as PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    button: {
        marginTop:100,
        margin: 30,
        width: 150
    },
    text:{
        marginTop: 30,
        marginLeft: 30,
        width: 350,
        position: "relative",
    },
    text1:{
        marginTop: 30,
        marginLeft: 30,
        width: 250
    },
    text2:{
        marginTop: 30,
        marginLeft: 30,
        width: 180
    },
    text3:{
        marginTop: 30,
        marginLeft: 30,
        width: 200
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',

    },
    container: {
        marginLeft: theme.spacing(1),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),

    },
    paper: {
        padding: theme.spacing(3),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        width: 'max-content',
        backgroundColor: '#CFD8DC'
    },
    fixedHeight: {
        height: 350,
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },
    footer: {
        padding: theme.spacing(3, 2),
        top: 'auto',
        backgroundColor: '#e0e0e0',
        width: '100%'
        // marginTop: `calc(100% - 80%)`,
    },
}));

let id_edit = ''




export default function AccidentPage() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const {request} = useHttp()
    const [form, setForm] = useState({
        id:'', dateA: '', idAuto: '', auto: '', description: ''
    })
    const changeHandler = event => {

        setForm({ ...form,[event.target.id]: event.target.value})
    }
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const auth = useContext(AuthContext)
    const logoutHandler = async () => {
        try {
            auth.logout()
        } catch (e) {

        }
    }
    const [startDate, setStartDate] = useState(new Date());
    const addHandler = async () => {
        if(id_edit !== '')
        {

            const form = document.forms["accidentForm"];
            const model = form.elements["auto"].value;
            const type = form.elements["description"].value;
            EditClient(id_edit, startDate, model, type)
            id_edit = ''
        }
        else {
            try {

                // console.log()
                const data = await request('/api/accident/add', 'POST', {...form, startDate})
                if (data.ok === true) {
                    const type = await data.name
                    document.querySelector("tbody").append(row(type));
                }
            } catch (e) {

            }
        }
    }

    const selAuto = []
    async function selectAuto() {
        const response = await fetch("/api/auto/all")
        if (response.ok === true){
            const auto = await response.json()
            auto.forEach(type => {
                selAuto.push({id: type._id, auto: type.mark[0].name+ " " + type.model[0].name})
            })
        }
    }

    async function getAuto() {
        const response = await fetch("/api/accident/all")
        if (response.ok === true){
            const client = await response.json()
            let rows = document.querySelector("tbody")
            client.forEach(type => {

                rows.append(row(type))
            })
        }
    }
    getAuto()

    async function getID(id) {
        id_edit = ''
        const response = await fetch("/api/accident/" + id);
        if (response.ok === true) {
            const auto = await response.json()
            setStartDate(new Date(auto.date))
            setForm({ ...form,
                id: auto._id,
                idAuto: auto.auto[0]._id,
                auto: auto.auto[0].auto,
                description: auto.description})
            id_edit = auto._id;
        }
    }

    async function DeleteClient(id) {
        const response = await fetch("/api/accident/" + id, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    async function EditClient(id_edit, startDate, auto, description) {
        const response = await fetch("api/accident/edit", {
            method: "PUT",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id_edit,
                date: startDate,
                auto: [form.idAuto, auto],
                description: description
            })
        });
        if (response.ok === true) {
            const client = await response.json()
            getAuto()
            row(client)
        }
    }

    function row(client) {
        if(document.querySelector("tr[data-rowid='" + client._id + "']"))
        {
            document.querySelector("tr[data-rowid='" + client._id + "']").remove()
        }

        const tr = document.createElement("tr");
        tr.setAttribute("style", "padding:10px;");
        tr.setAttribute("data-rowid", client._id);

        const markTd = document.createElement("td");
        markTd.setAttribute("style", "padding:5px; text-align: center;");
        markTd.append(client.date.slice(0,10));
        tr.append(markTd);


        const modelTd = document.createElement("td");
        modelTd.setAttribute("style", "padding:5px; text-align: center");
        modelTd.append(client.auto[0].auto);
        tr.append(modelTd);

        const typeTd = document.createElement("td");
        typeTd.setAttribute("style", "padding:5px; text-align: center");
        typeTd.append(client.description);
        tr.append(typeTd);

        const linksTd = document.createElement("td");
        linksTd.setAttribute("style", "cursor:pointer;margin:10px;");

        const editLink = document.createElement("a");
        editLink.setAttribute("data-id", client._id);
        editLink.setAttribute("style", "cursor:pointer;margin:10px;");
        editLink.append("Изменить");
        editLink.addEventListener("click", e => {
            e.preventDefault();
            getID(client._id);
        });
        linksTd.append(editLink);

        const removeLink = document.createElement("a");
        removeLink.setAttribute("data-id", client._id);
        removeLink.setAttribute("style", "cursor:pointer;margin:10px; margin-bottom: 10px;");
        removeLink.append("Удалить");
        removeLink.addEventListener("click", e => {
            e.preventDefault();
            DeleteClient(client._id);
        });

        linksTd.append(removeLink);
        tr.appendChild(linksTd);

        return tr;
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Учёт заказов аренды авто
                    </Typography>
                    <Button component="h1" variant="h6" color="inherit" noWrap onClick={logoutHandler}>Выход</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>{mainListItems}</List>
                <Divider/>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <form noValidate name="accidentForm">
                    <Autocomplete className={classes.text}
                                  onChange={(event, value) => setForm({ ...form, auto: value, idAuto: value.id})}
                                  id="auto"
                                  variant="outlined"
                                  size="small"
                                  margin="normal"
                                  required
                                  name="auto"
                                  value={form.auto}
                                  autoComplete="auto"
                                  autoFocus
                                  onClick={selectAuto()}
                                  options={selAuto}
                                  getOptionLabel={(option) => {
                                      if (option.hasOwnProperty('auto')) {
                                          return option.auto;
                                      }
                                      return option;
                                  }}
                                  getOptionSelected={(option) => option.selected === form.auto}
                                  style={{ position: "absolute", marginLeft: 420, marginTop: 5}}
                                  renderInput={(params) => <TextField {...params} label="Автомобиль"/>}
                    />

                    <TextField className={classes.text}
                               variant="outlined"
                               size="small"
                               margin="normal"
                               required
                               id="description"
                               label="Описание"
                               onChange={changeHandler}
                               value={form.description}
                               name="description"
                               autoComplete="description"
                               autoFocus
                               style={{ position: "absolute", marginTop: 70}}
                    />
                    <p style={{ position: "absolute", marginTop: 10, marginLeft: 30}}>Дата происшествия</p>
                    <DatePicker
                        id="dateA"
                        label="Дата происшествия"
                        variant="outlined"
                        size="small"
                        margin="normal"
                        required
                        className={classes.text}
                        dateFormat="d.M.yyyy"
                        // style={{ position: "absolute", marginTop: 40}}
                        // InputLabelProps={{
                        //     shrink: true,
                        // }}
                        selected={startDate}
                        // onChange={(event, value) => setForm({ ...form, dateA: value})}*/}
                        onChange={(date) => setStartDate(date)}
                    />

                    <Button className={classes.button}
                            type="button"
                            variant="contained"
                            onClick={addHandler}
                            color="primary"
                            style={{ marginLeft: 420, marginTop: 20}}
                        // disabled={form.mark === "" || form.model === ""|| form.type === "" || form.clas === "" || form.park === "" || form.sum === ""}
                    >
                        Сохранить
                    </Button>
                </form>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <Title>Список происшествий</Title>
                                <table  >
                                    <thead>
                                    <tr>
                                        <th>Дата происшествия</th>
                                        <th>Автомобиль</th>
                                        <th>Описание</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </Paper>
                        </Grid>
                    </Grid>

                </Container>


            </main>
            {/*<footer className={classes.footer}>*/}
            {/*    <Container maxWidth="sm">*/}
            {/*        <Typography variant="body1">My sticky footer can be found here.</Typography>*/}
            {/*    </Container>*/}
            {/*</footer>*/}
        </div>

    );
}
