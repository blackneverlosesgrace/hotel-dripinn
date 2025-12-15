import { useState } from 'react';

export default function BookingCard({ room }) {
  const [duration] = useState("24h");
  const [variant] = useState("standard");

  const calculatePrice = (room, duration, variant) => {
    if (duration === "4h") {
      if (variant === "deluxe" && room.price4hDeluxe) return room.price4hDeluxe;
      return room.price4hStandard || (room.price24h ? Math.round(room.price24h * 0.5) : 0);
    }
    if (duration === "6h") {
      const base = room.price4hStandard || (room.price24h ? Math.round(room.price24h * 0.5) : 0);
      return base ? Math.round(base * 1.4) : 0;
    }
    return room.price24h;
  };

  const price = calculatePrice(room, duration, variant);

  return (
    <aside className="sticky top-24 bg-white p-6 rounded shadow">
      <div>{price}</div>
      {/* date pickers */}
      {/* duration */}
      {/* variant */}
      {/* book button */}
    </aside>
  );
}
