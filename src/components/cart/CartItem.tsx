type CartItemProps = {
  name: string;
  price: number;
  image: string;
  quantity: number;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
};

export default function CartItem({ name, price, image, quantity, onRemove, onQuantityChange }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <img src={image} alt={name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-red-600 font-bold">₹{price}</div>
        <div className="flex items-center mt-2">
          <button onClick={() => onQuantityChange(quantity - 1)} className="px-2">-</button>
          <span className="mx-2">{quantity}</span>
          <button onClick={() => onQuantityChange(quantity + 1)} className="px-2">+</button>
        </div>
      </div>
      <button onClick={onRemove} className="text-red-500 hover:underline">Remove</button>
    </div>
  );
} 