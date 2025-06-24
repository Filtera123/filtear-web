import { Link } from 'react-router-dom';

export default function UserProfile() {
  return (
    <div className="w-64 bg-white p-4 rounded-b-sm flex items-center">
      <Link to="/profile" className="flex items-center">
        <img 
          src="https://picsum.photos/id/64/40/40" 
          alt="User Avatar" 
          className="rounded-full w-10 h-10 mr-2"
        />
      </Link>
    </div>
  );
}