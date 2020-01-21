import React, { useState, useEffect } from 'react';
import {  Conection  } from './services/conection';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  
}));

//function createData(name, calories, fat, carbs, protein) {
//  return { name, calories, fat, carbs, protein };
//}

//const rows = [
 // createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
 // createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
 // createData('Eclair', 262, 16.0, 24, 6.0),
  //createData('Cupcake', 305, 3.7, 67, 4.3),
 // createData('Gingerbread', 356, 16.0, 49, 3.9),
//];

const initialState = {
  nome: "", 
  email: "",
  password: ""
}



export default function ButtonAppBar() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [ state, setState ] = useState([]);
  const [FormData, setFormData] = useState(initialState);

  const getList = async () =>{

    try{

      let {data}  = await Conection.get('/users');
      setState(data);
      //alert(data);
      console.log(data);

    }catch{

    }

  }

  const sendData = async (e) => {
    e.preventDefault()
    try{
      if(FormData.nome && FormData.email && FormData.password){
        await Conection.post('/users', FormData)
        setFormData(initialState)
        getList();
      }
    }catch{

    }
  }

  const deleteUser = async (id) => {
    try{
      await Conection.delete(`/users/${id}`)
      getList();
    }catch (error){

    }
  }
  
  const getUser = async (id) => {
    try{
      let { data  } = await Conection.get(`/users/${id}`)
      setState(data);
      console.log(data);
    }catch{

    }
  }

  const changeStateData = ({  target  }) => {

    const {name, value } = target

    setFormData({
      ...FormData,
      [name]: value
    })
  }

  useEffect(()=>{
    getList()
  }, [])

  return (
    <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Lista de usuários
        </Typography>
        <Button color="inherit" onClick={handleOpen}>+</Button>
      </Toolbar>
    </AppBar>
    <TableContainer component={Paper}>
    <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell align="left">Nome</TableCell>
          <TableCell align="left">E-mail</TableCell>
          <TableCell align="left">Senha</TableCell>
          <TableCell align="center">Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {state.map(row => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">
              {row.id}
            </TableCell>
            <TableCell align="left">{row.nome}</TableCell>
            <TableCell align="left">{row.email}</TableCell>
            <TableCell align="left">{row.password}</TableCell>
            <TableCell align="center">
            <Button color="inherit" onClick={() => deleteUser(row.id)}>Delete</Button>
            <Button color="inherit" onClick={() => getUser(row.id)}>Editar</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
 

  <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h1>Adicionar Usuário</h1>
          <form onSubmit={sendData} className={classes.root} align="center" noValidate autoComplete="off">
            <TextField fullWidth name="nome" onChange={changeStateData} value={FormData.nome} id="nome" label="Nome" />
            <TextField fullWidth name="email" onChange={changeStateData} value={FormData.email} id="email" label="E-mail" />
            <TextField fullWidth name="password" onChange={changeStateData} value={FormData.password} id="senha" label="Senha" />
            <Button type="submit" color="primary">Adicionar</Button>
          </form>
          </div>
        </Fade>
      </Modal>
  </div>
  
  );
}