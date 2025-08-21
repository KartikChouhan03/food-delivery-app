import React, { useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets.js'


const Navbar = () => {

  const [menu,setMenu] = useState("home");


  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <ul className='navbar-menu'>
        <li className={menu==="home"?"active":""}>home</li>
        <li className={menu==="menu"?"active":""}>menu</li>
        <li className={menu==="home"?"active":""}>mobile-app</li>
        <li className={menu==="home"?"active":""}>contact us</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className='dot'></div>
        </div>
        <button>Sign in</button>
      </div>
    </div>
  )
}

export default Navbar
