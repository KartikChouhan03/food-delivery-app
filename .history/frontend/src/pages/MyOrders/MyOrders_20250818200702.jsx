import React, { useState, useContext, useEffect } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets.js';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      
      console.log("Orders response:", response.data);
      
      if (response.data.success) {
        setData(response.data.data || []);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {loading ? (
          <p>Loading orders...</p>
        ) : data.length === 0 ? (
          <p>No orders found</p>
        ) : (
          data.map((order, index) => (
            <div key={order._id || index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items?.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p>Rs. {order.amount}.00</p>
              <p>Items: {order.items?.length || 0}</p>
              <p><span>&#x25cf;</span><b>{order.status || 'Pending'}</b></p>
              <button>Track Order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
