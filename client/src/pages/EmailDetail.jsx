import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmailDetail = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/emails/${id}`)
      .then(response => setEmail(response.data))
      .catch(error => console.error("Error fetching email:", error));
  }, [id]);

  if (!email) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{email.subject}</h2>
      <p className="text-gray-600">{email.sender}</p>
      <p className="mt-4">{email.body}</p>
    </div>
  );
};

export default EmailDetail;
