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
import {TextField} from "@material-ui/core";
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
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        width: 'max-content',
        flexDirection: 'column',
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

export default function ClassPage() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const {request} = useHttp()
    const [form, setForm] = useState({
        id:'', name: ''
    })
    const changeHandler = event => {

        setForm({ ...form, [event.target.name]: event.target.value, [event.target.id]: event.target.value})
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
            const form = document.forms["classForm"];
            const name = form.elements["name"].value;
            EditClass(id_edit, name)
            id_edit = ''
        }
        else {
            try {

                const data = await request('/api/class/add', 'POST', {...form})
                if (data.ok === true) {
                    const clas = await data.name
                    document.querySelector("tbody").append(row(clas));
                }

            } catch (e) {

            }
        }
    }


    async function getClass() {
        const response = await fetch("/api/class/all")
        if (response.ok === true){
            const clas = await response.json()
            let rows = document.querySelector("tbody")
            clas.forEach(clas => {
                rows.append(row(clas))
            })
        }
    }
    getClass()

    async function getID(id) {
        id_edit = ''
        const response = await fetch("/api/class/" + id);
        if (response.ok === true) {
            const clas = await response.json()
            setForm({ ...form, id: clas._id, name: clas.name })
            id_edit = clas._id;
        }
    }

    async function DeleteClass(id) {
        const response = await fetch("/api/class/" + id, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    async function EditClass(clasId, clasName) {
        const response = await fetch("api/class/edit", {
            method: "PUT",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                id: clasId,
                name: clasName,
            })
        });
        if (response.ok === true) {
            const clas = await response.json()
            getClass()
            row(clas)
        }
    }

    function row(clas) {

        if(document.querySelector("tr[data-rowid='" + clas._id + "']"))
        {
            document.querySelector("tr[data-rowid='" + clas._id + "']").remove()
        }

        const tr = document.createElement("tr");
        tr.setAttribute("style", "padding:10px;");
        tr.setAttribute("data-rowid", clas._id);

        const nameTd = document.createElement("td");
        nameTd.setAttribute("style", "padding:5px; text-align: center");
        nameTd.append(clas.name);
        tr.append(nameTd);

        const linksTd = document.createElement("td");
        linksTd.setAttribute("style", "cursor:pointer;margin:10px;");

        const editLink = document.createElement("a");
        editLink.setAttribute("data-id", clas._id);
        editLink.setAttribute("style", "cursor:pointer;margin:10px;");
        editLink.append("Изменить");
        editLink.addEventListener("click", e => {
            e.preventDefault();
            getID(clas._id);
        });
        linksTd.append(editLink);

        const removeLink = document.createElement("a");
        removeLink.setAttribute("data-id", clas._id);
        removeLink.setAttribute("style", "cursor:pointer;margin:10px; margin-bottom: 10px;");
        removeLink.append("Удалить");
        removeLink.addEventListener("click", e => {
            e.preventDefault();
            DeleteClass(clas._id);
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
                <form noValidate name="classForm">
                    <TextField className={classes.text}
                               variant="outlined"
                               size="small"
                               margin="normal"
                               required
                               id="name"
                               label="Наименование класса"
                               onChange={changeHandler}
                               value={form.name}
                               name="name"
                               autoComplete="name"
                               autoFocus
                    />
                    <Button className={classes.button}
                            type="button"
                            variant="contained"
                            onClick={addHandler}
                            color="primary"
                            disabled={form.name === ""}
                    >
                        Сохранить
                    </Button>
                </form>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <Title>Список классов автомобилей</Title>
                                <table  >
                                    <thead>
                                    <tr>
                                        <th>Класс автомобиля</th>
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
