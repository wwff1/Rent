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
import {InputLabel, TextField} from "@material-ui/core";
import Title from "./Title";
import {useHttp} from "../hooks/http.hook";
import StickyFooter from "./Footer";

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
        margin: 30,
        width: 150
    },
    text:{
        marginTop: 30,
        marginLeft: 30,
        width: 450
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

export default function ClientPage() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const {request} = useHttp()
    const [form, setForm] = useState({
        id:'', fio: '', passport: '', experience: '', number: ''
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
    const addHandler = async () => {
        if(id_edit !== '')
        {
            const form = document.forms["clientForm"];
            const fio = form.elements["fio"].value;
            const passport = form.elements["passport"].value;
            const experience = form.elements["experience"].value;
            const number = form.elements["number"].value;
            EditClient(id_edit, fio, passport, experience,  number)
            id_edit = ''
        }
        else {
            try {

                const data = await request('/api/client/add', 'POST', {...form})
                if (data.ok === true) {
                    const type = await data.name
                    document.querySelector("tbody").append(row(type));
                }
            } catch (e) {

            }
        }
    }


    async function getClient() {
        const response = await fetch("/api/client/all")
        if (response.ok === true){
            const client = await response.json()
            let rows = document.querySelector("tbody")
            client.forEach(type => {
                rows.append(row(type))
            })
        }
    }
    getClient()

    async function getID(id) {
        id_edit = ''
        const response = await fetch("/api/client/" + id);
        if (response.ok === true) {
            const client = await response.json()
            setForm({ ...form, id: client._id, fio: client.fio, passport: client.passport, experience: client.experience, number: client.number})
            id_edit = client._id;
        }
    }

    async function DeleteClient(id) {
        const response = await fetch("/api/client/" + id, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    async function EditClient(clientId, clientFio, clientPassport, clientExperience, clientNumber) {
        const response = await fetch("api/client/edit", {
            method: "PUT",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                id: clientId,
                fio: clientFio,
                passport: clientPassport,
                experience: clientExperience,
                number: clientNumber
            })
        });
        if (response.ok === true) {
            const client = await response.json()
            getClient()
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

        const FioTd = document.createElement("td");
        FioTd.setAttribute("style", "padding:5px; text-align: center");
        FioTd.append(client.fio);
        tr.append(FioTd);

        const passportTd = document.createElement("td");
        passportTd.setAttribute("style", "padding:5px; text-align: center");
        passportTd.append(client.passport);
        tr.append(passportTd);

        const experienceTd = document.createElement("td");
        experienceTd.setAttribute("style", "padding:5px; text-align: center");
        experienceTd.append(client.experience);
        tr.append(experienceTd);

        const numberTd = document.createElement("td");
        numberTd.setAttribute("style", "padding:5px; text-align: center");
        numberTd.append(client.number);
        tr.append(numberTd);

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
                <form noValidate name="clientForm">
                    <TextField className={classes.text}
                               variant="outlined"
                               size="small"
                               margin="normal"
                               required
                               id="fio"
                               label="ФИО"
                               onChange={changeHandler}
                               value={form.fio}
                               name="fio"
                               autoComplete="fio"
                               autoFocus
                    />
                    <TextField className={classes.text1}
                               variant="outlined"
                               size="small"
                               margin="normal"
                               required
                               id="passport"
                               label="Паспорт"
                               onChange={changeHandler}
                               value={form.passport}
                               name="passport"
                               autoComplete="passport"
                               autoFocus
                    />
                    <TextField className={classes.text2}
                               variant="outlined"
                               size="small"
                               margin="normal"
                               required
                               id="experience"
                               type="number"
                               InputProps={{ inputProps: { min: 1} }}
                               label="Стаж вождения"
                               onChange={changeHandler}
                               value={form.experience}
                               name="experience"
                               autoComplete="experience"
                               autoFocus
                    />
                    <TextField className={classes.text3}
                               variant="outlined"
                               size="small"
                               margin="normal"
                               required
                               id="number"
                               label="Номер телефона"
                               onChange={changeHandler}
                               value={form.number}
                               name="number"
                               autoComplete="number"
                               autoFocus
                    />
                    <Button className={classes.button}
                            type="button"
                            variant="contained"
                            onClick={addHandler}
                            color="primary"
                            disabled={form.fio === "" || form.passport === ""|| form.experience === "" || form.number === ""}

                    >
                        Сохранить
                    </Button>
                </form>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <Title>Список клиентов</Title>
                                <table  >
                                    <thead>
                                    <tr>
                                        <th>Фио</th>
                                        <th>Данные паспорта</th>
                                        <th>Стаж вождения</th>
                                        <th>Номер телефона</th>
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
