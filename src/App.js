import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import ShareIcon from "@material-ui/icons/Share";
import Pagination from "@material-ui/lab/Pagination";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import CommentIcon from '@material-ui/icons/Comment';
import GitHubIcon from '@material-ui/icons/GitHub';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { Comment } from "semantic-ui-react";
import Chip from '@material-ui/core/Chip';
import Modal from '@material-ui/core/Modal';

import Navbar from "./Navbar";

import Form from "./Form";
import Web3 from "web3";
import WhistleBlower from "./contract/whistleBlower.json";
import moment from "moment";

import { create } from "ipfs-http-client";
const client = create("https://ipfs.infura.io:5001/api/v0");

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff",
  },
  hero: {
    backgroundImage: ` url('https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwallpapercave.com%2Fwp%2FlKeljXZ.jpg&f=1&nofb=1')`,
    height: "66.5vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // color: "#fff",
    // fontSize: "4rem",
    // [theme.breakpoints.down("sm")]: {
    //   height: 300,
    //   fontSize: "3em",
    // },
  },
  blogsContainer: {
    paddingTop: theme.spacing(3),
  },
  blogTitle: {
    fontWeight: 600,
    textAlign: "center",
    padding: "40px",
    fontSize: "32px",
    paddingBottom: theme.spacing(3),
    fontFamily: 'Montserrat, sans-serif',
  },

  card: {
    maxWidth: "100%",
    boxShadow: "0 0 1em rgba(0, 0, 0, 0.5)",
  },
  media: {
    height: 240,
  },
  cardActions: {
    display: "flex",
    margin: "0 10px",
    justifyContent: "space-between",
  },
  commentBox: {
    display: "flex",
    flexDirection: "row",
    margin: "0 10px",
  },
  commentBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: "0 5px",
    fontSize: "0.75em",
  },
  commentTitle: {
    color: "blue",
    isolation: "isolate"
    
  },
  author: {
    display: "flex",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
  },
  clickableIcon: {
    color: "#0072E5",
    isolation: "isolate",
    "&:hover": {
      color: "#43a1ff",
      background: "transparent",
      padding: "3px",
      borderRadius: "50%",
      isolation: "isolate",
    },
  },
  likes: {
    display: "flex",
    alignItems: "flex-end",
  },
  like: {
    color: "#0072E5",
    isolation: "isolate",
    margin: "0 5px",
  },
  p: {
    color: "darkGray",
  },
  h: {
    color: "rgb(95, 95, 95)",
  },
  chip: {
    marginRight: "2.5px",
    marginLeft: "2.5px"
  },
  row: {
    maxWidth: '1140px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
  },
   rowLeft:{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: '#fff',
  },
  leftTitle:{
    fontSize: '4rem',
    fontFamily: 'Roboto, sans-serif'
  },
  tagLine:{
    fontSize: '2.5rem',
    fontWeight: '400',
    fontFamily: 'Montserrat, sans-serif',
  },
  footerDiv:{
    display:'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
  
}));


const modal_style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  overflowY: 'initial',
  height: '80vh',
  overflowY: 'auto',
}

function App() {
  const classes = useStyles();

  const [isLoggedIn, setLoginStatus] = useState(false);
  const [newEntry, setNewEntry] = useState(false);
  //useStates for intergration purpose
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [whistleBlower, setWhistleBlower] = useState(null);
  const [postsCount, setpostsCount] = useState(0);

  //useStates for Modal purpose
  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const [modals,setModals] = useState([]);

  useEffect(() => {
    async function loadWeb3() {
      //Setting up Web3
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "1.Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }
    async function loadBlockchainData() {
      //Declare Web3
      const web3 = window.web3;
      //console.log(web3);

      //Load account
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

      setAccount(accounts[0]);

      //Network ID
      const networkId = await web3.eth.net.getId();
      const networkData = WhistleBlower.networks[networkId];

      if (networkData) {
        // Assign contract
        const whistleBlower = new web3.eth.Contract(
          WhistleBlower.abi,
          networkData.address
        );
        setWhistleBlower(whistleBlower);
        // Get post count
        const count = await whistleBlower.methods.postCount().call();
        setpostsCount(count);
        // Load files&sort by the newest
        var vector = [];
        var vm = [];
        //for (var i = count; i >=1; i--) {
        for (var i = count-1; i >=0; i--) {
          const post = await whistleBlower.methods.posts(i).call();
          vector.push(post);
          vm.push({id : post.postId, value: 0});
        }
        setPosts(vector);
        setModals(vm);
      } else {
        window.alert(
          "In Metamask,Connect to Ropsten Network"
        );
      }
      setLoading(false);
    }

    loadWeb3();
    loadBlockchainData();
  }, [postsCount]);

  const [file, updateFile] = useState(null);
  const [Hash, updateHash] = useState(``);

  /**********UPLOADING FILE***********************************************/
  function uploadFile(e) {
    console.log(e.target.files[0]);
    updateFile(e.target.files[0]);
  }
  /******************** GENERATE HASH*************************************/
  async function generateHash() {
    try {
      const added = await client.add(file);
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // console.log(url);
      updateHash(added.path);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  /*********************ADDING TO BLOCKCHAIN**********************************/
  function addToChain(postDetails) {
    //loading true
    setLoading(true);
    //method call
    whistleBlower.methods
      .uploadPost(
        Hash,
        postDetails.title,
        postDetails.category,
        postDetails.description
      )
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setLoading(false);
        updateFile(null);

        window.location.reload();
      })
      .on("error", (e) => {
        // window.alert("Error");
        setLoading(false);
      });
    setpostsCount(postsCount + 1);
  }
  /********************INCREASE UPVOTES***************************************/
  function increaseUpvotes(id) {
    setLoading(true);

    whistleBlower.methods
      .postUpvoted(id)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log(hash);
        setLoading(false);
        // loop over the files and find the provided id.
        let updatedList = posts.map((post) => {
          if (post.postId == id) {
            const val = Number(post.upvotes) + 1; //<-------------------PROBLEM------------------------>
            console.log("inside map   " + val);
            return { ...post, upvotes: val }; //gets everything that was already in item, and updates "done"
          }
          return post; // else return unmodified item
        });
        setPosts(updatedList); // set state to new object with updated list
        //window.location.reload()
      })
      .on("error", (e) => {
        //window.alert("Error");
        setLoading(false);
      });
  }
  /********************DECREASE UPVOTES***************************************/
  function increaseDownvotes(id) {
    setLoading(true);

    whistleBlower.methods
      .postDownvoted(id)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log(hash);
        setLoading(false);
        // loop over the files and find the provided id.
        let updatedList = posts.map((post) => {
          if (post.postId == id) {
            const val = Number(post.downvotes) + 1; //<-------------------PROBLEM------------------------>
            console.log("inside map   " + val);
            return { ...post, downvotes: val }; //gets everything that was already in item, and updates "done"
          }
          return post; // else return unmodified item
        });
        setPosts(updatedList); // set state to new object with updated list
        //window.location.reload()
      })
      .on("error", (e) => {
       // window.alert("Error");
        setLoading(false);
      });
  }
  /********************MODAL ONCLICK***************************************/
function handleModalClick(id){

  let updatedList = modals.map((modal)=>{
    if(modal.id == id){
      const gg = Number(modal.value)^1;
      return { ...modal, value : gg }
    }
    return modal;
  });
  setModals(updatedList);
}
  return (
    <div className="App">
    {/************** Navbar ************************/}
    <Navbar
          Hash={Hash}
          uploadFile={uploadFile}
          generateHash={generateHash}
          addToChain={addToChain}
     />

      <Box className={classes.hero}>
          <div className={classes.row}>
            <div className={classes.rowLeft}>
              <div className={classes.leftTitle}>Welcome to<br/><strong>Whistle Blower!</strong></div>
              <div className={classes.tagLine}>Defending facts on the web</div>
            </div> 
            <div className={classes.rowRight}>
                <img src="https://media.discordapp.net/attachments/919450418499710997/921313013997400104/The_7_Elements_of_Art.png" width={'100%'} ></img>
            </div>
          </div>  
      </Box>
    
      <Container
        maxWidth="lg"
        className={classes.blogsContainer}
        // style={{ display: newEntry ? "none" : "block" }}
      >
        <Typography variant="h5" className={classes.blogTitle}>
          <h2>Explore</h2>
        </Typography>

        <Grid container spacing={5}>
          {posts.map((post, key) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card className={classes.card}>
                  <CardHeader
                    action={<IconButton aria-label="settings"></IconButton>}
                    title={post.postTitle}
                    subheader={moment
                      .unix(post.uploadTime)
                      .format("h:mm:ss A M/D/Y")}
                  />

                  <CardActionArea onClick={() => handleModalClick(post.postId)}>
                    <CardMedia
                      className={classes.media}
                      image={`https://ipfs.infura.io/ipfs/${post.postHash}`}
                      title="Contemplative Reptile"
                      style={{backgoundImage : 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png")'}}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        className={classes.h}
                      >
                        <Chip label={post.postCategory} color="success" className={classes.chip}/>

                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        className={classes.p}
                      >
                        {post.postDescription}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  {console.log("Modals",modals)}
                  <Modal
                    open = {typeof modals[key] === 'undefined'? false : modals[key].value}
                    onClose={() => handleModalClick(post.postId)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                  <Box sx={modal_style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        <h3 style={{textAlign : 'center'}}>{post.postTitle}</h3>
                      </Typography>
                      {/* <img src = {`https://ipfs.infura.io/ipfs/${post.postHash}`}  width="400px"/> */}
                      <img src={`https://ipfs.infura.io/ipfs/${post.postHash}`} onError={(e)=>{e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"}} width = "400px"/>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      {post.postDescription}
                      </Typography>
                    </Box>
                  </Modal>
            
                  <CardActions className={classes.cardActions}>
                    <div className={classes.likes}>
                      <span className={classes.like}>{post.upvotes}</span>
                      <ThumbUpIcon
                        className={classes.clickableIcon}
                        onClick={() => increaseUpvotes(post.postId)}
                      />
                    </div>
                   
                    <div className={classes.likes}>
                      <span className={classes.like}>{post.downvotes}</span>
                      <ThumbDownIcon
                        className={classes.clickableIcon}
                        onClick={() => increaseDownvotes(post.postId)}
                      />
                    </div>
                    {/********************* Comments *************************/}
                    <div className={classes.likes}>
                    <span className={classes.like}>{0}</span>
                    {console.log(post)}
                    <Link className={classes.commentTitle} to={`/whistleblowerUI/comments/1`} props={1}>
                    <CommentIcon
                      className={classes.clickableIcon}
                      onClick={() => alert("comments")}
                    />
                    </Link>
                  </div>

                    <Box className={classes.author}>
                      <Box ml={2}></Box>
                    </Box>
                    <Box>
                      <ShareIcon
                        onClick={() => alert("Share")}
                        className={classes.clickableIcon}
                      />
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box my={4} className={classes.paginationContainer}>
          <Pagination count={10} />
        </Box>
      </Container>

       
      <Box 
  style={{backgroundColor: '#0072E5', 
  color: 'white',
  marginTop: '30px',
  float: 'bottom',
  positon: 'sticky'
  }}>        
  <Container maxWidth="lg" style={{ paddingBottom : '30px', paddingTop: '30px'}}>
      <div className={classes.footerDiv}>
      <div>
        <img src="https://cdn.discordapp.com/attachments/919450418499710997/921367864852766740/NFT_team_Logo_500_x_300_px.png" width='200px'></img>
      </div>
      <div>Copyright © NonFungibleTeam 2021-22</div>
      <div style={{ fontSize: '15px' ,paddingBottom: '10px', marginTop : "10px", textAlign: 'center'}}>
      <YouTubeIcon
        className={classes.clickableIcon}
        style={{marginRight :'10px',marginLeft : '10px', color: 'white'}}
        onClick={() => window.open("https://www.youtube.com/channel/UCTF80cOCjQcEDvV4QIQeEQA",'_blank')}
      />
      <GitHubIcon
          className={classes.clickableIcon}
          style={{marginRight :'10px',marginLeft : '10px', color: 'white'}}
          onClick={() => window.open('https://github.com/darshana-v/WhistleBlower', '_blank')}
        />
      </div>
      </div>
  </Container>
</Box>
      
      </div>
  );
}

export default App;
