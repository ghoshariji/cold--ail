import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold">Onebox</h2>
      <ul className="mt-4">
        <li className="mb-2"><Link to="/category/Inbox" className="hover:underline">Inbox</Link></li>
        <li className="mb-2"><Link to="/category/Spam" className="hover:underline">Spam</Link></li>
        <li className="mb-2"><Link to="/category/Out%20of%20Office" className="hover:underline">Out of Office</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
