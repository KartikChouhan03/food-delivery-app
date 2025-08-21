import React from 'react'
import './MyOrders.css'
import { useState } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'

const MyOders = () => {

  const {url,token} = useContext(StoreContext);
  const [data,setData] =useState([]);

  const fetchOrders = async () =>{
    const response = await axios.post(url+"/api/orders/userorders",{},{headers:{token}});
    setData(response.data.data);
  }

  useEffect(()=>{
    if(token){
      fetchOrders();
    }
  },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index)=>{
          return(
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p></p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOders
