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

import Form from "./Form";
import Web3 from "web3";
import WhistleBlower from "./contract/whistlerblower.json";
import moment from "moment";

import { create } from "ipfs-http-client";
const client = create("https://ipfs.infura.io:5001/api/v0");

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff",
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
        for (var i = count; i >= 1; i--) {
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Typography
                variant="h5"
                color="primary"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                <Link href="#" underline="none">
                  {"WhistleBlower"}
                </Link>
              </Typography>
            </IconButton>
            <Button
              className="newEntry"
              color="primary"
              style={{
                position: "absolute",
                right: "10%",
                display:
                  !isLoggedIn || (isLoggedIn && newEntry) ? "none" : "block",
              }}
              onClick={() => {
                setNewEntry(true);
              }}
            >
              New Entry
            </Button>
            <Button
              className="newEntry"
              color="primary"
              style={{
                position: "absolute",
                right: "10%",
                display: isLoggedIn && newEntry ? "block" : "none",
              }}
              onClick={() => {
                setNewEntry(false);
              }}
            >
              Home
            </Button>
            <Button
              className="login"
              color="primary"
              style={{
                position: "absolute",
                right: "1%",
                display: isLoggedIn ? "none" : "block",
              }}
              onClick={() => {
                setLoginStatus(true);
              }}
            >
              Login
            </Button>
            <Button
              className="logout"
              color="primary"
              style={{
                position: "absolute",
                right: "1%",
                display: !isLoggedIn ? "none" : "block",
              }}
              onClick={() => {
                setNewEntry(false);
                setLoginStatus(false);
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Box className={classes.hero}>
        <Box>WhistleBlower UI</Box>
      </Box>

      <Container
        maxWidth="lg"
        className={classes.blogsContainer}
        style={{ display: newEntry ? "none" : "block" }}
      >
        <Typography variant="h4" className={classes.blogTitle}>
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
                      image="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                      title="Contemplative Reptile"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        className={classes.h}
                      >
                        {post.postTitle}
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

      {/***************************************FORM *****************************************/}
      <div style={{ display: !newEntry ? "none" : "block" }}>
        <Form
          Hash={Hash}
          uploadFile={uploadFile}
          generateHash={generateHash}
          addToChain={addToChain}
        />
      </div>
    </div>
  );
}

export default App;
