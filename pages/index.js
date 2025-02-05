import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  return <h1>مرحبًا بك في مشروعك!</h1>;
}

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      setOrders(querySnapshot.docs.map(doc => doc.data()));
    };
    
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>طلبات العملاء</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>{order.customerName} - {order.details}</li>
          ))}
        </ul>
      ) : (
        <p>لا توجد طلبات بعد.</p>
      )}
    </div>
  );