import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import ShareIcon from '@material-ui/icons/Share';
import Pagination from '@material-ui/lab/Pagination';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import Form from './Form'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff"
  },
  hero: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80')`,
    height: "250px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "3em"
    }
  },
  blogsContainer: {
    paddingTop: theme.spacing(3)
  },
  blogTitle: {
    fontWeight: 800,
    paddingBottom: theme.spacing(3)
  },
  card: {
    maxWidth: "100%",
  },
  media: {
    height: 240
  },
  cardActions: {
    display: "flex",
    margin: "0 10px",
    justifyContent: "space-between"
  },
  author: {
    display: "flex"
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center"
  },
  clickableIcon: {
    color: '#0072E5',
    isolation: "isolate",
    '&:hover': {
    color: 'green',
    background: '#E8E8E8',
    padding:'3px',
    borderRadius: '50%',
    isolation: "isolate"
    },
  },
  likes:{
    display: "flex",
    alignItems: "flex-end"
  },
  like: {
    color: '#0072E5',
    isolation: "isolate",
    margin: "0 5px",
    
  },
  p: {
    color: "darkGray"
  },
  h:{
    color: "rgb(95, 95, 95)"
  },

}));

function App() {
  const classes = useStyles();
  var [isLoggedIn, setLoginStatus] = useState(false);
  var [newEntry,setNewEntry] = useState(false);
  return (
    <div className="App">
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="primary" aria-label="menu" sx={{ mr: 2 }}>
            <Typography variant="h5" color="primary" component="div" sx={{ flexGrow: 1 }}>
              <Link href="#" underline="none">
                {'WhistleBlower'}
              </Link>
            </Typography>
          </IconButton>
          <Button className="newEntry" color="primary" style={{position: 'absolute', right: '10%', display: !isLoggedIn || (isLoggedIn && newEntry) ? 'none':'block'}} onClick={() => {setNewEntry(true);}}>New Entry</Button>
          <Button className="newEntry" color="primary" style={{position: 'absolute', right: '10%', display: isLoggedIn&& newEntry ? 'block':'none'}} onClick={() => {setNewEntry(false);}}>Home</Button>
          <Button className="login" color="primary" style={{position: 'absolute', right: '1%', display: isLoggedIn ? 'none':'block'}} onClick={() => {setLoginStatus(true);}}>Login</Button>
          <Button className="logout" color="primary" style={{position: 'absolute', right: '1%', display: !isLoggedIn ? 'none':'block'}} onClick={() => {setNewEntry(false);setLoginStatus(false) ;}}>Logout</Button>
        </Toolbar>
      </AppBar>
      </Box>
      <Box className={classes.hero}>
        <Box>WhistleBlower UI</Box>
      </Box>
      <Container maxWidth="lg" className={classes.blogsContainer} style={{display: newEntry ? 'none':'block'}}>
        <Typography variant="h4" className={classes.blogTitle}>
          Welcome to The WhistleBlower!
        </Typography>
        <Grid container spacing={3} >
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
        <CardHeader
        action={
          <IconButton aria-label="settings">
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2" className={classes.h} >
                    React useContext
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" className={classes.p}>
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.cardActions}>
              <div className={classes.likes}>
                      <span className={classes.like}>45</span>
                      <ThumbUpIcon className={classes.clickableIcon} onClick={()=> alert("liked")}/>
                    </div>
                    <div className={classes.likes}>
                    <span className={classes.like}>45</span>
                      <ThumbDownIcon className={classes.clickableIcon} onClick={()=> alert("disliked")}/>
                    </div>
                <Box className={classes.author}>          
                  <Box ml={2}>
                  </Box>
                </Box>
                <Box>
                  <ShareIcon onClick={() => alert("Share")} className={classes.clickableIcon}/>
                </Box>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
            <CardHeader
        action={
          <IconButton aria-label="settings">
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2" className={classes.h}>
                    React Router
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" className={classes.p}>
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.cardActions}>
              <div className={classes.likes}>
                      <span className={classes.like}>45</span>
                      <ThumbUpIcon className={classes.clickableIcon} onClick={()=> alert("liked")}/>
                    </div>
                    <div className={classes.likes}>
                    <span className={classes.like}>45</span>
                      <ThumbDownIcon className={classes.clickableIcon} onClick={()=> alert("disliked")}/>
              </div>
                <Box className={classes.author}>
                  <Box ml={2}>      
                  </Box>
                </Box>
                <Box>
                  <ShareIcon onClick={() => alert("Share")} className={classes.clickableIcon}/>
                </Box>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
            <CardHeader
        action={
          <IconButton aria-label="settings">
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2" className={classes.h}>
                    React useContext
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" className={classes.p}>
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.cardActions}>
                    <div className={classes.likes}>
                      <span className={classes.like}>45</span>
                      <ThumbUpIcon className={classes.clickableIcon} onClick={()=> alert("liked")}/>
                    </div>
                    <div className={classes.likes}>
                    <span className={classes.like}>45</span>
                      <ThumbDownIcon className={classes.clickableIcon} onClick={()=> alert("disliked")}/>
                    </div>
                
                <Box>
                  <ShareIcon onClick={() => alert("Share")} className={classes.clickableIcon}/>
                </Box>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
            <CardHeader
        action={
          <IconButton aria-label="settings">
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2" className={classes.h}>
                    React useContext
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" className={classes.p}>
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.cardActions}>
              <div className={classes.likes}>
                      <span className={classes.like}>45</span>
                      <ThumbUpIcon className={classes.clickableIcon} onClick={()=> alert("liked")}/>
                    </div>
                    <div className={classes.likes}>
                    <span className={classes.like}>45</span>
                      <ThumbDownIcon className={classes.clickableIcon} onClick={()=> alert("disliked")}/>
                    </div>
                
                <Box>
                  <ShareIcon onClick={() => alert("Share")} className={classes.clickableIcon}/>
                </Box>
              </CardActions>
            </Card>
          </Grid>
          
        </Grid>
        <Box my={4} className={classes.paginationContainer}>
          <Pagination count={10} />
        </Box>


      </Container>
      <div style={{display: !newEntry ? 'none':'block'}}>
        <Form />

      </div>
    </div>
  );
}

export default App;
