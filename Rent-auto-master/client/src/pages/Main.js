// import React, {useContext, useState} from 'react';
// import clsx from 'clsx';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Drawer from '@material-ui/core/Drawer';
// import Box from '@material-ui/core/Box';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import List from '@material-ui/core/List';
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
// import IconButton from '@material-ui/core/IconButton';
// import Badge from '@material-ui/core/Badge';
// import Container from '@material-ui/core/Container';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import Link from '@material-ui/core/Link';
// import MenuIcon from '@material-ui/icons/Menu';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import NotificationsIcon from '@material-ui/icons/Notifications';
// import {makeStyles} from "@material-ui/core/styles";
// import {useHttp} from "../hooks/http.hook";
// import {AuthContext} from "../context/AuthContext";
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// import PeopleIcon from '@material-ui/icons/People';
// import BarChartIcon from '@material-ui/icons/BarChart';
// import LayersIcon from '@material-ui/icons/Layers';
// import AssignmentIcon from '@material-ui/icons/Assignment';
// import Button from "@material-ui/core/Button";
//
//
// const drawerWidth = 240;
//
// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//     },
//     toolbar: {
//         paddingRight: 24, // keep right padding when drawer closed
//     },
//     toolbarIcon: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         padding: '0 8px',
//         ...theme.mixins.toolbar,
//     },
//     appBar: {
//         zIndex: theme.zIndex.drawer + 1,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//         }),
//     },
//     appBarShift: {
//         marginLeft: drawerWidth,
//         width: `calc(100% - ${drawerWidth}px)`,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     },
//     menuButton: {
//         marginRight: 36,
//     },
//     menuButtonHidden: {
//         display: 'none',
//     },
//     title: {
//         flexGrow: 1,
//     },
//     drawerPaper: {
//         position: 'relative',
//         whiteSpace: 'nowrap',
//         width: drawerWidth,
//         transition: theme.transitions.create('width', {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     },
//     drawerPaperClose: {
//         overflowX: 'hidden',
//         transition: theme.transitions.create('width', {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//         }),
//         width: theme.spacing(7),
//         [theme.breakpoints.up('sm')]: {
//             width: theme.spacing(9),
//         },
//     },
//     appBarSpacer: theme.mixins.toolbar,
//     content: {
//         flexGrow: 1,
//         height: '100vh',
//         overflow: 'auto',
//     },
//     container: {
//         paddingTop: theme.spacing(4),
//         paddingBottom: theme.spacing(4),
//     },
//     paper: {
//         padding: theme.spacing(2),
//         display: 'flex',
//         overflow: 'auto',
//         flexDirection: 'column',
//     },
//     fixedHeight: {
//         height: 240,
//     },
// }));
//
// let id_edit = ''
//
// export const mainListItems = (
//     <div>
//         <ListItem button>
//             <ListItemIcon>
//                 {/*<DashboardIcon />*/}
//             </ListItemIcon>
//             <ListItemText primary="Dashboard" />
//         </ListItem>
//         <ListItem button>
//             <ListItemIcon>
//                 {/*<ShoppingCartIcon />*/}
//             </ListItemIcon>
//             <ListItemText primary="Orders" />
//         </ListItem>
//         <ListItem button>
//             <ListItemIcon>
//                 {/*<PeopleIcon />*/}
//             </ListItemIcon>
//             <ListItemText primary="Customers" />
//         </ListItem>
//         <ListItem button>
//             <ListItemIcon>
//                 {/*<BarChartIcon />*/}
//             </ListItemIcon>
//             <ListItemText primary="Reports" />
//         </ListItem>
//         <ListItem button>
//             <ListItemIcon>
//                 {/*<LayersIcon />*/}
//             </ListItemIcon>
//             <ListItemText primary="Integrations" />
//         </ListItem>
//     </div>
// );
//
//
// export const Main = () => {
//     const classes = useStyles();
//     const [open, setOpen] = React.useState(true);
//     const handleDrawerOpen = () => {
//         setOpen(true);
//     };
//     const handleDrawerClose = () => {
//         setOpen(false);
//     };
//
//     const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
//
//     const auth = useContext(AuthContext)
//
//     const [form, setForm] = useState({
//         id:'', name: ''
//     })
//     const changeHandler = event => {
//
//         setForm({ ...form, [event.target.name]: event.target.value, [event.target.id]: event.target.value})
//     }
//     const {request} = useHttp()
//     const [anchorEl, setAnchorEl] = React.useState(null);
//
//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//
//     const logoutHandler = async () => {
//         try {
//             auth.logout()
//         } catch (e)
//         {
//
//         }
//     }
//
//     const addHandler = async () => {
//         if(id_edit !== '')
//         {
//             const form = document.forms["markForm"];
//             const name = form.elements["name"].value;
//             EditUser(id_edit, name)
//             id_edit = ''
//         }
//         else {
//             try {
//
//                 const data = await request('/api/mark/add', 'POST', {...form})
//                 if (data.ok === true) {
//                     const mark = await data.name
//                     document.querySelector("tbody").append(row(mark));
//                 }
//
//             } catch (e) {
//
//             }
//         }
//     }
//
//     async function getMark() {
//         const response = await fetch("/api/mark/all")
//         if (response.ok === true){
//             const mark = await response.json()
//             let rows = document.querySelector("tbody")
//             mark.forEach(mark => {
//                 rows.append(row(mark))
//             })
//         }
//     }
//
//     async function getID(id) {
//         id_edit = ''
//         const response = await fetch("/api/mark/" + id);
//         if (response.ok === true) {
//             const mark = await response.json()
//             setForm({ ...form, id: mark._id, name: mark.name })
//             id_edit = mark._id;
//         }
//     }
//
//     async function DeleteUser(id) {
//         const response = await fetch("/api/mark/" + id, {
//             method: "DELETE",
//             headers: { "Accept": "application/json" }
//         });
//         if (response.ok === true) {
//             document.querySelector("tr[data-rowid='" + id + "']").remove()
//         }
//     }
//
//     async function EditUser(markId, markName) {
//         const response = await fetch("api/mark/edit", {
//             method: "PUT",
//             headers: { "Accept": "application/json", "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 id: markId,
//                 name: markName,
//             })
//         });
//         if (response.ok === true) {
//             const mark = await response.json()
//             row(mark)
//         }
//     }
//
//     function row(mark) {
//
//         if(document.querySelector("tr[data-rowid='" + mark._id + "']"))
//         {
//             document.querySelector("tr[data-rowid='" + mark._id + "']").remove()
//         }
//
//         const tr = document.createElement("tr");
//         tr.setAttribute("style", "padding:10px;");
//         tr.setAttribute("data-rowid", mark._id);
//
//         const idTd = document.createElement("td");
//         idTd.append(mark._id);
//         tr.append(idTd);
//
//         const nameTd = document.createElement("td");
//         nameTd.append(mark.name);
//         tr.append(nameTd);
//
//         const linksTd = document.createElement("td");
//         linksTd.setAttribute("style", "cursor:pointer;margin:10px;");
//
//         const editLink = document.createElement("a");
//         editLink.setAttribute("data-id", mark._id);
//         editLink.setAttribute("style", "cursor:pointer;margin:10px;");
//         editLink.append("Изменить");
//         editLink.addEventListener("click", e => {
//             e.preventDefault();
//             getID(mark._id);
//         });
//         linksTd.append(editLink);
//
//         const removeLink = document.createElement("a");
//         removeLink.setAttribute("data-id", mark._id);
//         removeLink.setAttribute("style", "cursor:pointer;margin:10px; margin-bottom: 5px;");
//         removeLink.append("Удалить");
//         removeLink.addEventListener("click", e => {
//             e.preventDefault();
//             DeleteUser(mark._id);
//         });
//
//         linksTd.append(removeLink);
//         tr.appendChild(linksTd);
//
//         return tr;
//     }
//
//     const handleClose = () => {
//         setAnchorEl(null)
//     };
//
//     return(
//
//         <div className={classes.root}>
//                 <ListItem button>
//                     <ListItemIcon>
//                         {/*<DashboardIcon />*/}
//                     </ListItemIcon>
//                     <ListItemText primary="Dashboard" />
//                 </ListItem>
//                 <ListItem button>
//                     <ListItemIcon>
//                         {/*<ShoppingCartIcon />*/}
//                     </ListItemIcon>
//                     <ListItemText primary="Orders" />
//                 </ListItem>
//                 <ListItem button>
//                     <ListItemIcon>
//                         {/*<PeopleIcon />*/}
//                     </ListItemIcon>
//                     <ListItemText primary="Customers" />
//                 </ListItem>
//                 <ListItem button>
//                     <ListItemIcon>
//                         {/*<BarChartIcon />*/}
//                     </ListItemIcon>
//                     <ListItemText primary="Reports" />
//                 </ListItem>
//                 <ListItem button>
//                     <ListItemIcon>
//                         {/*<LayersIcon />*/}
//                     </ListItemIcon>
//                     <ListItemText primary="Integrations" />
//                 </ListItem>
//             <CssBaseline />
//             <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
//                 <Toolbar className={classes.toolbar}>
//                     <IconButton
//                         edge="start"
//                         color="inherit"
//                         aria-label="open drawer"
//                         onClick={handleDrawerOpen}
//                         className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
//                     >
//                         <MenuIcon />
//                     </IconButton>
//                     <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
//                         Dashboard
//                     </Typography>
//                     <Button color="inherit" onClick={logoutHandler}>Выход</Button>
//                 </Toolbar>
//             </AppBar>
//             <Drawer
//                 variant="permanent"
//                 classes={{
//                     paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
//                 }}
//                 open={open}
//             >
//                 <div className={classes.toolbarIcon}>
//                     <IconButton onClick={handleDrawerClose}>
//                         {/*<ChevronLeftIcon />*/}
//                     </IconButton>
//                 </div>
//                 <Divider />
//                 <List>{}</List>
//                 <Divider />
//                 <List>{}</List>
//             </Drawer>
//             <main className={classes.content}>
//                 <div className={classes.appBarSpacer} />
//                 <Container maxWidth="lg" className={classes.container}>
//                     <Grid container spacing={3}>
//                         {/* Chart */}
//                         <Grid item xs={12} md={8} lg={9}>
//                             <Paper className={fixedHeightPaper}>
//                                 {/*<Chart />*/}
//                             </Paper>
//                         </Grid>
//                         {/* Recent Deposits */}
//                         <Grid item xs={12} md={4} lg={3}>
//                             <Paper className={fixedHeightPaper}>
//                                 {/*<Deposits />*/}
//                             </Paper>
//                         </Grid>
//                         {/* Recent Orders */}
//                         <Grid item xs={12}>
//                             <Paper className={classes.paper}>
//                                 {/*<Orders />*/}
//                             </Paper>
//                         </Grid>
//                     </Grid>
//                     <Box pt={4}>
//                         {/*<Copyright />*/}
//                     </Box>
//                 </Container>
//             </main>
//         </div>
//
//
//         // <html onLoad={getMark()}>
//         // <head>
//         //     <meta charSet="utf-8"/>
//         //     <meta name="viewport" content="width=device-width"/>
//         //     <title>Список пользователей</title>
//         // </head>
//         // <body>
//         //     <div className={classes.root} >
//         //         <AppBar style={{ backgroundColor: '#5c6bc0' }}>
//         //             <Toolbar>
//         //                 <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleClick}>
//         //                     <MenuIcon />
//         //                 </IconButton>
//         //                 <Menu
//         //                     id="simple-menu"
//         //                     anchorEl={anchorEl}
//         //                     keepMounted
//         //                     open={Boolean(anchorEl)}
//         //                     onClose={handleClose}
//         //                 >
//         //                     <MenuItem onClick={handleClose}>Заказы</MenuItem>
//         //                     <MenuItem onClick={handleClose}>Автомобили</MenuItem>
//         //                     <MenuItem onClick={handleClose}>Марки автомобилей</MenuItem>
//         //                     <MenuItem onClick={handleClose}>Модели автомобилей</MenuItem>
//         //                     <MenuItem onClick={handleClose}>Парки</MenuItem>
//         //                     <MenuItem onClick={handleClose}>Происшествия</MenuItem>
//         //                     <MenuItem onClick={handleClose}>Тип кузова</MenuItem>
//         //                     <MenuItem onClick={handleClose}>Класс автомобилей</MenuItem>
//         //                 </Menu>
//         //                 <Typography variant="h6" className={classes.title}>
//         //                     Учет заказов авто
//         //                 </Typography>
//         //                 <Button color="inherit" onClick={logoutHandler}>Выход</Button>
//         //             </Toolbar>
//         //         </AppBar>
//         //         <form className={classes.form} noValidate name="markForm">
//         //             <TextField
//         //                 variant="outlined"
//         //                 margin="normal"
//         //                 required
//         //                 fullWidth
//         //                 id="id"
//         //                 display="none"
//         //                 visible="none"
//         //                 onChange={changeHandler}
//         //                 value={form._id}
//         //                 name="id"
//         //                 autoComplete="id"
//         //                 autoFocus
//         //             />
//         //             <TextField
//         //                 variant="outlined"
//         //                 margin="normal"
//         //                 required
//         //                 fullWidth
//         //                 id="name"
//         //                 label="Наименование марки"
//         //                 onChange={changeHandler}
//         //                 value={form.name}
//         //                 name="name"
//         //                 autoComplete="name"
//         //                 autoFocus
//         //             />
//         //             <Button
//         //                 type="button"
//         //                 fullWidth
//         //                 variant="contained"
//         //                 onClick={addHandler}
//         //                 color="primary"
//         //                 className={classes.submit}
//         //                 disabled={form.name === ""}
//         //             >
//         //                 Добавить
//         //             </Button>
//         //         </form>
//         //         <table className={classes.cardGrid} >
//         //             <thead>
//         //             <tr>
//         //                 <th>Id</th>
//         //                 <th>Марка автомобиля</th>
//         //                 <th></th>
//         //             </tr>
//         //             </thead>
//         //             <tbody>
//         //             </tbody>
//         //         </table>
//         //     </div>
//         // </body>
//         // </html>
//
//     )
// }