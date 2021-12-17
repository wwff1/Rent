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
import DatePicker from "react-datepicker";
import ReactHTMLTableToExcel from "react-html-table-to-excel"

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
        width: 220
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

export default function OrderPage() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [startDate1, setStartDate1] = useState(new Date());
    const [startDate2, setStartDate2] = useState(new Date());
    const [currency, setCurrency] = React.useState()

    const {request} = useHttp()
    const [form, setForm] = useState({
        id:'', idAuto: '', auto: '', idClient: '', client: '', sum: ''
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

            const form = document.forms["orderForm"];
            const auto = form.elements["auto"].value;
            const client = form.elements["client"].value;
            EditClient(id_edit, startDate1, startDate2 , client, auto)
            id_edit = ''
        }
        else {
            try {

                const data = await request('/api/order/add', 'POST', {...form, startDate1, startDate2})
                if (data.ok === true) {
                    const type = await data.name
                    row(type);
                }
            } catch (e) {

            }
        }
    }


    const selMark = []
    async function selectMark() {
        const response = await fetch("/api/client/all")
        if (response.ok === true){
            const mark = await response.json()
            mark.forEach(type => {
                selMark.push({id: type._id, name: type.fio})
            })
        }
    }

    const selAuto = []
    async function selectAuto() {
        const response = await fetch("/api/auto/all")
        if (response.ok === true){
            const auto = await response.json()
            auto.forEach(type => {
                selAuto.push({id: type._id, auto: type.mark[0].name+ " " + type.model[0].name, sum: type.sum})
            })
        }
    }

    async function getAuto() {
        const response = await fetch("/api/order/all")
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
        const response = await fetch("/api/order/" + id);
        if (response.ok === true) {
            const auto = await response.json()
            let sum = ''
            for (let i = 0; i < selAuto.length; i++)
                if (selAuto[i]['id'] === auto.auto[0]._id)
                    sum = selAuto[i]['sum']
            setStartDate1(new Date(auto.date_start))
            setStartDate2(new Date(auto.date_end))
            setForm({ ...form,
                id: auto._id,
                idAuto: auto.auto[0]._id,
                idClient: auto.client[0]._id,
                client: auto.client[0].fio,
                auto: auto.auto[0].auto,
                sum: sum
                })
            id_edit = auto._id;
        }
    }

    async function DeleteClient(id) {
        const response = await fetch("/api/order/" + id, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    async function EditClient(id_edit, startDate1, startDate2 , client, auto) {
        console.log(id_edit, startDate1, startDate2 , client, auto)
        let sum = ''
        for (let i = 0; i < selAuto.length; i++)
            if (selAuto[i]['auto'] === auto)
                sum = selAuto[i]['sum']
        const response = await fetch("api/order/edit", {
            method: "PUT",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id_edit,
                date_start: startDate1,
                date_end: startDate2,
                client: [form.idClient, client],
                auto: [form.idAuto, auto, sum]
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

        const dateSTd = document.createElement("td");
        dateSTd.setAttribute("style", "padding:5px; text-align: center");
        dateSTd.append(client.date_start.slice(0,10));
        tr.append(dateSTd);

        const dateETd = document.createElement("td");
        dateETd.setAttribute("style", "padding:5px; text-align: center");
        dateETd.append(client.date_end.slice(0,10));
        tr.append(dateETd);

        const modelTd = document.createElement("td");
        modelTd.setAttribute("style", "padding:5px; text-align: center");
        modelTd.append(client.client[0].fio);
        tr.append(modelTd);

        const markTd = document.createElement("td");
        markTd.setAttribute("style", "padding:5px; text-align: center");
        markTd.append(client.auto[0].auto);
        tr.append(markTd);

        const typeTd = document.createElement("td");
        typeTd.setAttribute("style", "padding:5px; text-align: center");
        typeTd.append(client.sum);
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
                <form noValidate name="orderForm">
                    <p style={{ position: "absolute", marginTop: 10, marginLeft: 30}}>Дата начала аренды</p>
                    <DatePicker
                        id="dateA"
                        label="Дата происшествия"
                        variant="outlined"
                        size="small"
                        margin="normal"
                        required
                        className={classes.text}
                        dateFormat="d.M.yyyy"
                        selected={startDate1}
                        onChange={(date) => setStartDate1(date)}
                    />
                    <p style={{ position: "absolute", marginTop: 10, marginLeft: 30}}>Дата конца аренды</p>
                    <DatePicker
                        id="dateB"
                        label="Дата происшествия"
                        variant="outlined"
                        size="small"
                        margin="normal"
                        required
                        className={classes.text}
                        dateFormat="d.M.yyyy"
                        style={{ width: 300 , marginLeft: 70}}
                        selected={startDate2}
                        onChange={(date) => setStartDate2(date)}
                    />
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
                                  style={{ position: "absolute", marginLeft: 400}}
                                  renderInput={(params) => <TextField {...params} label="Автомобиль"/>}
                    />

                    <Autocomplete className={classes.text}
                                  onChange={(event, value) => setForm({ ...form, client: value, idClient: value.id})}
                                  id="client"
                                  variant="outlined"
                                  size="small"
                                  margin="normal"
                                  required
                                  name="type"
                                  value={form.client}
                                  autoComplete="client"
                                  autoFocus
                                  onClick={selectMark()}
                                  options={selMark}

                                  getOptionLabel={(option) => {
                                      if (option.hasOwnProperty('name')) {
                                          return option.name;
                                      }
                                      return option;
                                  }}
                                  style={{ width: 300 }}
                                  renderInput={(params) => <TextField {...params} label="Клиент"/>}
                    />
                    <Button className={classes.button}
                            type="button"
                            variant="contained"
                            onClick={addHandler}
                            color="primary"
                        // disabled={form.mark === "" || form.model === ""|| form.type === "" || form.clas === "" || form.park === "" || form.sum === ""}
                    >
                        Сохранить
                    </Button>
                    </form>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <Title>Список заказов</Title>
                                <ReactHTMLTableToExcel
                                    table="excel"
                                    filename="Rent"
                                    sheet="Sheet"
                                    buttonText="Экспорт"
                                />
                                <table  id="excel">
                                    <thead>
                                    <tr>
                                        <th>Дата начала</th>
                                        <th>Дата конца</th>
                                        <th>Клиент</th>
                                        <th>Автомобиль</th>
                                        <th>Стоимость аренды</th>
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
