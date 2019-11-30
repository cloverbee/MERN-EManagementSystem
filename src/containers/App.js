import React from 'react';
import {BrowserRouter, Route, Switch } from "react-router-dom";
import List from '../containers/List';
import Create from '../containers/Create';
import Edit from '../containers/Edit';

class App extends React.Component{
    render(){
      return(
        <div style = {{display: "flex", justifyContent:"flex-start"}}>
          <BrowserRouter>
            <Switch>
              <Route exact = {true} path = '/' component = {List} />
              <Route path = '/create' component = {Create} />
              <Route path = '/edit' component = {Edit}/>
              
            </Switch>
          </BrowserRouter>
        </div>
      )
    }
}

export default App;
