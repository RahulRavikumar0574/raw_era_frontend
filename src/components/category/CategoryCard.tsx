import Link from 'next/link';

type CategoryCardProps = {
  name: string;
  image: string;
  href: string;
};

export default function CategoryCard({ name, image, href }: CategoryCardProps) {
  return (
    <Link href={href} className="block bg-white rounded-[var(--border-radius)] shadow hover:shadow-lg hover:border-[var(--accent)] border border-transparent transition p-4 text-center">
      <img src={image} alt={name} className="w-full h-32 object-cover rounded-[var(--border-radius)] mb-2" />
      <span className="font-semibold text-[var(--accent)]">{name}</span>
    </Link>
  );
}