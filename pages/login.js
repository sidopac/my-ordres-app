import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, uniqueCustomers: 0 });
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login"); // إذا لم يكن هناك مستخدم مسجل، يتم تحويله إلى صفحة تسجيل الدخول
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData = querySnapshot.docs.map(doc => doc.data());

        const uniqueCustomers = new Set(ordersData.map(order => order.customerName)).size;

        setOrders(ordersData);
        setStats({
          totalOrders: ordersData.length,
          uniqueCustomers: uniqueCustomers
        });
      };

      fetchOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login"); // بعد تسجيل الخروج، يعود المستخدم إلى صفحة تسجيل الدخول
  };

  if (!user) return <p>جارٍ التحقق...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>لوحة الإدارة</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>تسجيل الخروج</button>
      <h2>إحصائيات اليوم</h2>
      <p>عدد الطلبات: {stats.totalOrders}</p>
      <p>عدد العملاء الفريدين: {stats.uniqueCustomers}</p>

      <h2>جميع الطلبات</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              <strong>{order.customerName}:</strong> {order.details} ({order.status})
            </li>
          ))}
        </ul>
      ) : (
        <p>لا توجد طلبات حتى الآن.</p>
      )}
    </div>
  );
}