import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import {useNavigate} from "react"

const PlaceOrder = () => {
  // Accessing global state from StoreContext
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  // State to manage form input data for delivery information
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  // Handler for updating form data on input change
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  // Function to handle the order placement process
  const placeOrder = async (event) => {
    event.preventDefault(); // Prevent default form submission

    let orderItems = [];
    // Iterate through food_list to prepare order items based on cartItems
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    // Construct the order data payload
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
    };

    try {
      // Step 1: Call backend to create Razorpay order
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { orderId, amount, currency, newOrderId } = response.data;

        // Step 2: Configure Razorpay options
        const options = {
          key: "rzp_test_R6WPlMHSKb3FOO", // Replace with your actual Razorpay Key ID
          amount: amount,
          currency: currency,
          name: "Food Delivery App",
          description: "Order Payment",
          order_id: orderId, // Razorpay order ID from backend
          handler: async function (response) {
            // Step 3: Verify payment after successful transaction
            const verificationResponse = await axios.post(url + "/api/order/verify", {
              orderId: newOrderId, // Use newOrderId from your backend for verification
              success: "true", // Indicate successful payment
              paymentId: response.razorpay_payment_id, // Razorpay payment ID
            }, { headers: { token } });

            // Redirect based on verification result
            if (verificationResponse.data.success) {
              window.location.href = `/verify?success=true&orderId=${newOrderId}`;
            } else {
              window.location.href = `/verify?success=false&orderId=${newOrderId}`;
            }
          },
          prefill: {
            name: data.firstName + " " + data.lastName,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "tomato",
          },
        };

        // Create and open the Razorpay payment dialog
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Handle order placement failure from backend
        // console.error("Order placement failed:", response.data.message); // Log the actual error message
        // Redirect to verification page with false status if order placement fails
        window.location.href = `/verify?success=false&orderId=null`; // No orderId available
      }
    } catch (error) {
      console.error("Error during order placement or payment:", error);
      // Redirect to verification page with false status on network or other errors
      window.location.href = `/verify?success=false&orderId=null`; // No orderId available
    }
  };

  const navigate = useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])


  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipCode' onChange={onChangeHandler} value={data.zipCode} type='text' placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal:</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 59}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 59}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
