import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Sender() {
  const [customerName, setCustomerName] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !details) {
      alert("يرجى إدخال جميع البيانات");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        customerName,
        details,
        status: "pending", // حالة الطلب في البداية "قيد الانتظار"
        timestamp: serverTimestamp(), // وقت الإرسال
      });

      alert("تم إرسال الطلب بنجاح!");
      setCustomerName("");
      setDetails("");
    } catch (error) {
      console.error("خطأ في إرسال الطلب:", error);
      alert("حدث خطأ أثناء إرسال الطلب.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>إرسال طلب جديد</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>اسم العميل:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>تفاصيل الطلب:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
        <button type="submit">إرسال الطلب</button>
      </form>
    </div>
  );
}