import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const App = () => {
  const linkStyle={
    padding:5
  }
  return (
    <div>

      <Router>
        <div>
          <Link style={linkStyle} to='/'>authors</Link>
          <Link style={linkStyle} to='/books'>books</Link>
          <Link style={linkStyle} to='/addBooks'>add books</Link>
        </div>
        <Routes>
          <Route path="/" element={<Authors></Authors>}></Route>
          <Route path="/books" element={<Books></Books>}></Route>
          <Route path="/addBooks" element={<NewBook></NewBook>}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;