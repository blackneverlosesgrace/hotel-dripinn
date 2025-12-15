import { Link } from 'react-router-dom';
import { formatCurrency } from '../../data/constants';

export default function RoomCard({ room, duration }) {
  const getRoomPrice = (room, duration) => {
    if (duration === "4h") {
      return room.price4hStandard || (room.price24h ? Math.round(room.price24h * 0.5) : 0);
    }
    if (duration === "6h") {
      const base = room.price4hStandard || (room.price24h ? Math.round(room.price24h * 0.5) : 0);
      return base ? Math.round(base * 1.4) : 0;
    }
    return room.price24h;
  };

  const price = getRoomPrice(room, duration);

  return (
    <div className="bg-white rounded shadow">
      <img src={room.photos[0]} alt={room.hotel} />
      <h3>{room.hotel}</h3>
      <p>{room.location}</p>
      <div>{formatCurrency(price)}</div>
      <Link to={`/rooms/${room.id}`}>See availability</Link>
    </div>
  );
}
