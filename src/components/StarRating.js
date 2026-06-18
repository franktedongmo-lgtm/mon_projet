export default function StarRating({ value = 0, size = "h-4 w-4" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="inline-flex gap-0.5 text-gold-500">
      {stars.map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          fill={s <= Math.round(value) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={size}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.5l2.94 6.05 6.56.95-4.75 4.7 1.12 6.55L12 17.6l-5.87 3.15 1.12-6.55-4.75-4.7 6.56-.95L12 2.5z"
          />
        </svg>
      ))}
    </span>
  );
}
