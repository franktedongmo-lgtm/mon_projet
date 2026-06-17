export default function StarRating({ value = 0, size = "text-base" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className={`${size} text-gold-500`}>
      {stars.map((s) => (s <= Math.round(value) ? "★" : "☆")).join("")}
    </span>
  );
}
