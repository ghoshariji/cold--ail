import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EmailList from "../components/EmailList";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const { category } = useParams();
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/emails/category/${category || "Inbox"}`)
      .then(response => setEmails(response.data))
      .catch(error => console.error("Error fetching emails:", error));
  }, [category]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 w-full">
        <h1 className="text-xl font-bold">{category || "Inbox"}</h1>
        <EmailList emails={emails} />
      </div>
    </div>
  );
};

export default Home;
