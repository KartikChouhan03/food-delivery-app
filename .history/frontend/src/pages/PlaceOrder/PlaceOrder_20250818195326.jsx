import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

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

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
    };

    try {
      // Step 1: Place order in backend and create Razorpay order
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (!response.data.success) {
        alert("Failed to place order");
        return;
      }

      const { orderId, amount, currency } = response.data; // coming from backend

      // Step 2: Open Razorpay checkout
      const options = {
        key: "rzp_test_R6WPlMHSKb3FOO",
        amount: amount,
        currency: currency,
        name: "Food Delivery App",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (paymentResponse) {
          try {
            // Step 3: Verify payment
            const verificationResponse = await axios.post(url + "/api/order/verify", {
              orderId: response.data.dbOrderId, // MongoDB order id
              success: true,
              paymentId: paymentResponse.razorpay_payment_id,
            }, { headers: { token } });

            if (verificationResponse.data.success) {
              alert("Payment Successful ✅");
              window.location.href = "/myorders";
            } else {
              alert("Payment verification failed ❌");
            }
          } catch (error) {
            console.error("Verification error:", error);
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

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

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
