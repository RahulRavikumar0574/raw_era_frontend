type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="bg-[var(--accent)] text-white px-4 py-2"
      style={{
        borderRadius: 'var(--border-radius)',
        transition: 'all var(--transition)',
        fontWeight: 600
      }}
      onMouseOver={e => (e.currentTarget.style.background = '#ff8800')}
      onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
      {...props}
    >
      {children}
    </button>
  );
}