import { Link } from "react-router-dom";
import EmailCard from "./EmailCard";

const EmailList = ({ emails }) => {
  return (
    <div className="mt-4">
      {emails.map(email => (
        <Link to={`/email/${email._id}`} key={email._id}>
          <EmailCard email={email} />
        </Link>
      ))}
    </div>
  );
};

export default EmailList;
