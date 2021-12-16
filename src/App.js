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
    height: "100vh",
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
      fontSize: "3em",
    },
  },
  blogsContainer: {
    paddingTop: theme.spacing(3),
  },
  blogTitle: {
    fontWeight: 800,
    paddingBottom: theme.spacing(3),
  },
  card: {
    maxWidth: "100%",
  },
  media: {
    height: 240,
  },
  cardActions: {
    display: "flex",
    margin: "0 10px",
    justifyContent: "space-between",
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
      color: "green",
      background: "#E8E8E8",
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
}));

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
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
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
        for (var i = 0; i < count; i++) {
          const post = await whistleBlower.methods.posts(i).call();
          vector.push(post);
        }
        setPosts(vector);
      } else {
        window.alert(
          "whistlerblower contract not deployed to detected network."
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
        window.alert("Error");
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
        window.alert("Error");
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
        window.alert("Error");
        setLoading(false);
      });
  }
  return (
    <div className="App">
    {/************** Navbar ************************/}
    <Navbar />

      <Box className={classes.hero}>
        <Box>Welcome Guest</Box>
      </Box>

      <Container
        maxWidth="lg"
        className={classes.blogsContainer}
        // style={{ display: newEntry ? "none" : "block" }}
      >
        <Typography variant="h5" className={classes.blogTitle}>
          Welcome to The WhistleBlower!
        </Typography>

        <Grid container spacing={3}>
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

                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={`https://ipfs.infura.io/ipfs/${post.postHash}`}
                      title="Contemplative Reptile"
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
                    <span className={classes.like}>45</span>
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
        paddingTop: '10px',
        }}>
      <Container maxWidth="lg" style={{ paddingBottom : '3px'}}>
        <Grid container spacing={1}>
          <Grid item xs={3} sm={6}>
            <Box>
              <Link href="/" style={{color: 'white', textDecoration: 'none', fontSize: '25px' }}>
                <GitHubIcon
                      style={{marginRight :'10px'}}
                      onClick={() => alert("github")}
                />
                Github
              </Link>
            </Box>
          </Grid>
          <Grid item xs={3} sm={6}>
           <Box>
              <Link href="/" style={{color: 'white', textDecoration: 'none', float: 'right', fontSize: '25px'}}>
                <YouTubeIcon
                      style={{marginRight :'10px'}}
                      onClick={() => alert("github")}
                />
                Youtube
              </Link>
            </Box>
          </Grid>
        </Grid>
        </Container>
        <div style={{fontSize: '25px' ,paddingBottom: '10px', marginTop : "10px", textAlign: 'center'}}>
        Copyright © NonFungibleTeam 2021-22
    </div>
      </Box>
      
      </div>
  );
}

export default App;
