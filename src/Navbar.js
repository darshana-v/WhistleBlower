import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Form from "./Form";
const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff",
  },
  logo: {
    textDecoration: 'none',
    color: '#0072E5',
    fontWeight: 'bold'
  },
}));

function Navbar(props) {
  const classes = useStyles();
  var [isLoggedIn, setLoginStatus] = useState(false);
  var [newEntry, setNewEntry] = useState(false);
  return (
    <div>
    <div className="App" >
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
                <div className={classes.logo}>
                  {"WhistleBlower"}
                </div>
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
    </div>
    <div style={{ display: !newEntry ? "none" : "block" }}>
          <Form 
                Hash={props.Hash}
                uploadFile={props.uploadFile}
                generateHash={props.generateHash}
                addToChain={props.addToChain}
          />
      </div>
    </div>
  );
}

export default Navbar;