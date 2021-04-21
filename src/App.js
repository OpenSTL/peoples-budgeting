import React from 'react';
import logo from './logo.svg';

import PieChart from './components/piechart/index'
import NodeTree from './components/nodeTree/nodeTree'
import Header from './components/header/index'
import Footer from './components/footer/index'
import MainPage from './pages/infoPage'
import Sankey from './components/sankey/index'
import TreeMap from './components/treemap/treemap'
import Sunburst from './components/sunburst/index'

const App = () => {
  return (
    <div className="App">
      <Header/>
      <MainPage/>
      <Footer/>
      
    </div>
  );
}

export default App;
