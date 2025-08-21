import React, { useState } from 'react'
import './List.css'
import axios from 'axios'
import {toast }from "react-toastify"


const List = () => {

  const url = "http://localhost:4000";
  const [list, setList] = useState([]);


  const fetchList = async () =>{
    const response = await axios.get(`${url}/api/food/list`);
 
    if(response.data.success) {
      setList(response.data.list);
    }
    else{
      toast.error('Error')
    }
  }

  return (
    <div>
      
    </div>
  )
}

export default List
