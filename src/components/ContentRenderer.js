export default function ContentRenderer({ blocks }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        if (block.type === "text") {
          return (
            <p key={idx} className="text-gray-600">
              {block.value}
            </p>
          );
        }
        if (block.type === "image") {
          return (
            <img
              key={idx}
              src={block.src}
              alt={block.alt}
              className="rounded-lg max-w-full h-auto"
            />
          );
        }
        return null;
      })}
    </div>
  );
}
