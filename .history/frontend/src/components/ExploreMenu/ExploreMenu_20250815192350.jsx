import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets.js'


const ExploreMenu = () => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to statisfy your craving and elevate your dining experience, one delicious meal at a time. </p> 
      <div className='explore-menu-list'>
        {menu_list.map(()=>{
            return(
                <div key={index} className="explore-menu-list-item">
                    <img src={item.menu_image} alt="" />
                    <p>{itme.menu_name}</p>
                </div>
            )
        })}
      </div>
    </div>
  )
}

export default ExploreMenu
