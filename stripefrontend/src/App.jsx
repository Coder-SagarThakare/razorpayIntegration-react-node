import "./App.css";
import axios from "axios";

function App() {

  const courses = [
    {
      name: "React Basics",
      description:
        "Learn the fundamentals of React.js, including components and state management.",
      price: 499,
    },
    {
      name: "Advanced JavaScript",
      description:
        "Deep dive into modern JavaScript features and best practices.",
      price: 599,
    },
    {
      name: "CSS for Beginners",
      description: "Master the basics of CSS to create stunning web pages.",
      price: 399,
    },
    {
      name: "Full-Stack Development",
      description: "Become a full-stack developer with Node.js and React.",
      price: 999,
    },
  ];

  const makePayment = async (price, name, courseId) => {
    try {
      const options = {
        courseId: courseId,
        amount: price,
      };
      const res = await axios.post(
        "http://localhost:8000/create-order",
        options
      );
      const data = res.data.order;

      const user = {
        name: "Ajay shide",
        email: "ajayshinde@gmail.com",
        contact: "+919876543210",
      };

      const paymentOptions = {
        key: import.meta.env.VITE_KEY_ID,
        amount: data.amount, // Amount in paise
        currency: data.currency,
        name: "Test Company", // company name
        description: "Test Transaction",
        order_id: data.id, // Generate order_id on server
        handler: (response) => {
          console.log(response);
          alert("Payment Successful!");
        },
        prefill: { user },
        theme: {
          color: "#42BB7E",
        },
      };

      const razorpayInstance = new Razorpay(paymentOptions);
      razorpayInstance.open();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="app">
      <h1>Available Courses</h1>
      <div className="courses-container">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <p className="price">₹{course.price}</p>
            <button
              className="buy-btn"
              onClick={() =>
                makePayment(
                  course.price,
                  course.name,
                  `${course.name}-${index}`
                )
              }
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
