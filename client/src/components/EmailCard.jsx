const EmailCard = ({ email }) => {
    if (!email) return null; // Prevents rendering if email is undefined
  
    return (
      <div className="p-4 border rounded-lg shadow-sm mb-2 hover:bg-gray-100">
        <h3 className="font-bold">{email.subject || "No Subject"}</h3>
        <p className="text-gray-600">{email.sender || "Unknown Sender"}</p>
        <p className="text-sm">
          {email.body ? email.body.substring(0, 100) + "..." : "No content"}
        </p>
      </div>
    );
  };
  
  export default EmailCard;
  