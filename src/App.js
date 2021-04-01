import React from 'react';
import logo from './logo.svg';
import './App.css';
import PieChart from './components/piechart/index'
import NodeTree from './components/nodeTree/nodeTree'
import Header from './components/header/index'
//import Footer from './components/footer/index'
import MainPage from './pages/infoPage'
import Sankey from './components/sankey/index'
import TreeMap from './components/treemap/treemap'

const App = () => {
  return (
    <div className="App">
      <Header/>
      
      <MainPage/>
      
    </div>
  );
}

export default App;
