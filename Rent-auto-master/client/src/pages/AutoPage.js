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
        marginTop: -30,
        marginLeft: 30,
        width: 220,
        position: "absolute"
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

export default function AutoPage() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [currency, setCurrency] = React.useState()

    const {request} = useHttp()
    const [form, setForm] = useState({
        id:'', idMark: '', mark: '', idModel: '', model: '', idType: '', type: '', idClas: '', clas: '', idPark: '', park: '', sum: ''
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

            const form = document.forms["autoForm"];
            const mark = form.elements["mark"].value;
            const model = form.elements["model"].value;
            const type = form.elements["type"].value;
            const clas = form.elements["class"].value;
            const park = form.elements["park"].value;
            const sum = form.elements["sum"].value;
            console.log(form.elements["mark"])
            EditClient(id_edit, mark, model, type, clas, park, sum)
            id_edit = ''
        }
        else {
            try {

                const data = await request('/api/auto/add', 'POST', {...form})
                if (data.ok === true) {
                    const type = await data.name
                    document.querySelector("tbody").append(row(type));
                }
            } catch (e) {

            }
        }
    }

    const selMark = []
    async function selectMark() {
        const response = await fetch("/api/mark/all")
        if (response.ok === true){
            const mark = await response.json()
            mark.forEach(type => {
                selMark.push({id: type._id, name: type.name})
            })
        }
    }

    const selModel = []
    async function selectModel() {
        const response = await fetch("/api/model/all")
        if (response.ok === true){
            const model = await response.json()
            model.forEach(type => {
                selModel.push({id: type._id, name: type.name})
            })
        }
    }

    const selСlass = []
    async function selectClass() {
        const response = await fetch("/api/class/all")
        if (response.ok === true){
            const clas = await response.json()
            clas.forEach(type => {

                selСlass.push({id: type._id, name: type.name})
            })
        }
    }
    const selPark = []
    async function selectPark() {
        const response = await fetch("/api/park/all")
        if (response.ok === true){
            const park = await response.json()
            park.forEach(type => {
                selPark.push({id: type._id,name: type.name, address: type.address, number: type.number})
            })
        }
    }

    const selType = []
    async function selectType() {
        const response = await fetch("/api/type/all")
        if (response.ok === true){
            const type = await response.json()
            type.forEach(type => {
                selType.push({id: type._id, name: type.name})
            })
        }
    }

    async function getAuto() {
        const response = await fetch("/api/auto/all")
        if (response.ok === true){
            const client = await response.json()
            let rows = document.querySelector("tbody")
            // console.log(client)
            client.forEach(type => {

                rows.append(row(type))
            })
        }
    }
    getAuto()

    async function getID(id) {
        id_edit = ''
        const response = await fetch("/api/auto/" + id);
        if (response.ok === true) {
            const auto = await response.json()
            setForm({ ...form,
                id: auto._id,
                mark: auto.mark[0].name,
                idMark: auto.mark[0]._id,
                idModel: auto.model[0]._id,
                idType: auto.body[0]._id,
                idClas: auto.clas[0]._id,
                idPark: auto.park[0]._id,
                model: auto.model[0].name,
                type: auto.body[0].name,
                clas: auto.clas[0].name,
                park: auto.park[0].name,
                sum: auto.sum})
            id_edit = auto._id;
        }
    }

    async function DeleteClient(id) {
        const response = await fetch("/api/auto/" + id, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    async function EditClient(id_edit, mark, model, type, clas, park, sum) {
        console.log(id_edit, mark, model, type, clas, park, sum)
        // const response = await request('/api/auto/edit', 'PUT', {...form})
        const response = await fetch("api/auto/edit", {
            method: "PUT",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id_edit,
                mark: [form.idMark, mark],
                model: [form.idModel, model],
                body: [form.idType, type],
                clas: [form.idClas, clas],
                park: [form.idPark, park],
                sum: sum
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
        // getMark(client._id)
        const tr = document.createElement("tr");
        tr.setAttribute("style", "padding:10px;");
        tr.setAttribute("data-rowid", client._id);

        const markTd = document.createElement("td");
        markTd.setAttribute("style", "padding:5px; text-align: center");
        markTd.append(client.mark[0].name);
        tr.append(markTd);


        const modelTd = document.createElement("td");
        modelTd.setAttribute("style", "padding:5px; text-align: center");
        modelTd.append(client.model[0].name);
        tr.append(modelTd);

        const typeTd = document.createElement("td");
        typeTd.setAttribute("style", "padding:5px; text-align: center");
        typeTd.append(client.body[0].name);
        tr.append(typeTd);

        const classTd = document.createElement("td");
        classTd.setAttribute("style", "padding:5px; text-align: center");
        classTd.append(client.clas[0].name);
        tr.append(classTd);

        const parkTd = document.createElement("td");
        parkTd.setAttribute("style", "padding:5px; text-align: center");
        parkTd.append(client.park[0].name);
        tr.append(parkTd);

        const sumTd = document.createElement("td");
        sumTd.setAttribute("style", "padding:5px; text-align: center");
        sumTd.append(client.sum);
        tr.append(sumTd);

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
    const handleChange = (event) => {
        setCurrency(event.target.value);
    };

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
                <form noValidate name="autoForm">
                    <Autocomplete className={classes.text}
                                  onChange={(event, value) => setForm({ ...form, mark: value, idMark: value.id})}
                                  id="mark"
                                  variant="outlined"
                                  size="small"
                                  margin="normal"
                                  required
                                  name="mark"
                                  value={form.mark}
                                  autoComplete="mark"
                                  autoFocus
                                  onClick={selectMark()}
                                  options={selMark}
                                  getOptionLabel={(option) => {
                                      if (option.hasOwnProperty('name')) {
                                          return option.name;
                                      }
                                      return option;
                                  }}
                                  getOptionSelected={(option) => option.selected === form.mark}
                                  style={{width: 300 }}
                                  renderInput={(params) => <TextField {...params} label="Марка автомобиля"/>}
                    />
                    <Autocomplete className={classes.text}
                                  onChange={(event, value) => setForm({ ...form, model: value, idModel: value.id})}
                                  id="model"
                                  variant="outlined"
                                  size="small"
                                  margin="normal"
                                  required
                                  name="model"
                                  value={form.model}
                                  autoComplete="model"
                                  autoFocus
                                  onClick={selectModel()}
                                  // onClick={selectModel()}
                                  options={selModel}
                                  getOptionLabel={(option) => {
                                      if (option.hasOwnProperty('name')) {
                                          return option.name;
                                      }
                                      return option;
                                  }}
                                  style={{ width: 300, position: "absolute", marginLeft: 400, marginTop: -45}}
                                  renderInput={(params) => <TextField {...params} label="Модель автомобиля"/>}
                    />
                    <Autocomplete className={classes.text}
                                  onChange={(event, value) => setForm({ ...form, type: value, idType: value.id})}
                                  id="type"
                                  variant="outlined"
                                  size="small"
                                  margin="normal"
                                  required
                                  name="type"
                                  value={form.type}
                                  autoComplete="type"
                                  autoFocus
                                  onClick={selectType()}
                                  options={selType}
                                  getOptionLabel={(option) => {
                                      if (option.hasOwnProperty('name')) {
                                          return option.name;
                                      }
                                      return option;
                                  }}
                                  style={{ position: "absolute", marginLeft: 400, width: 300}}
                                  renderInput={(params) => <TextField {...params} label="Тип кузова"/>}
                    />
                    <Autocomplete className={classes.text}
                                  onChange={(event, value) => setForm({ ...form, clas: value, idClas: value.id})}
                                  id="class"
                                  variant="outlined"
                                  size="small"
                                  margin="normal"
                                  required
                                  name="class"
                                  value={form.clas}
                                  autoComplete="class"
                                  autoFocus
                                  onClick={selectClass()}
                                  options={selСlass}
                                  getOptionLabel={(option) => {
                                      if (option.hasOwnProperty('name')) {
                                          return option.name;
                                      }
                                      return option;
                                  }}
                                  style={{ width: 300 }}
                                  renderInput={(params) => <TextField {...params}  label="Класс автомобиля"/>}
                    />
                    <Autocomplete className={classes.text}
                                  onChange={(event, value) => setForm({ ...form, park: value, idPark: value.id})}
                                  id="park"
                                  variant="outlined"
                                  size="small"
                                  margin="normal"
                                  required
                                  name="park"
                                  value={form.park}
                                  // onChange={changeHandler}
                                  autoComplete="park"
                                  autoFocus

                                  onClick={selectPark()}
                                  options={selPark}
                                  getOptionLabel={(option) => {
                                      if (option.hasOwnProperty('name')) {
                                          return option.name;
                                      }
                                      return option;
                                  }}
                                  style={{ width: 300}}
                                  renderInput={(params) => <TextField {...params} label="Парк"/>}
                    />

                    <TextField className={classes.text2}
                               variant="outlined"
                               size="small"
                               margin="normal"
                               required
                               id="sum"
                               type="number"
                               InputProps={{ inputProps: { min: 1} }}
                               label="Стоимость аренды"
                               onChange={changeHandler}
                               value={form.sum}
                               name="sum"
                               autoComplete="sum"
                               autoFocus
                               style={{  marginLeft: 400}}
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
                                <Title>Список автомобилей</Title>
                                <table  >
                                    <thead>
                                    <tr>
                                        <th>Марка автомобиля</th>
                                        <th>Модель автомобиля</th>
                                        <th>Тип кузова</th>
                                        <th>Класс автомобиля</th>
                                        <th>Наименование парка</th>
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
