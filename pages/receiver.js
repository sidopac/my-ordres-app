import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function Receiver() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchOrders();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "accepted" });

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: "accepted" } : order
      ));

      alert("تم قبول الطلب!");
    } catch (error) {
      console.error("خطأ في قبول الطلب:", error);
      alert("حدث خطأ أثناء قبول الطلب.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>الطلبات الواردة</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id} style={{ marginBottom: "10px" }}>
              <strong>{order.customerName}:</strong> {order.details}  
              <span style={{ marginLeft: "10px", color: order.status === "accepted" ? "green" : "red" }}>
                ({order.status === "accepted" ? "مقبول" : "قيد الانتظار"})
              </span>
              {order.status === "pending" && (
                <button onClick={() => handleAccept(order.id)} style={{ marginLeft: "10px" }}>
                  قبول الطلب
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>لا توجد طلبات حتى الآن.</p>
      )}
    </div>
  );
}