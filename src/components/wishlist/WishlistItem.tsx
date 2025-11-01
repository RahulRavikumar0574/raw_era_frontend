type WishlistItemProps = {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
  onRemove: () => void;
};

export default function WishlistItem({ name, price, image, onAddToCart, onRemove }: WishlistItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <img src={image} alt={name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-red-600 font-bold">₹{price}</div>
      </div>
      <button onClick={onAddToCart} className="text-blue-500 hover:underline mr-2">Add to Cart</button>
      <button onClick={onRemove} className="text-red-500 hover:underline">Remove</button>
    </div>
  );
} 