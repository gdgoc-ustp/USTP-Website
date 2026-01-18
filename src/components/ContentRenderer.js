export default function ContentRenderer({ blocks }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return (
              <p key={i} className="text-gray-600">
                {block.value}
              </p>
            );

            case "image": {
            const sizeMap = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", full: "w-full" };
            const alignMap = { left: "mr-auto", center: "mx-auto", right: "ml-auto" };

            return (
                <img
                key={i}
                src={block.src}
                alt={block.alt || ""}
                className={`block rounded-lg border ${sizeMap[block.size || "md"]} ${alignMap[block.align || "center"]}`}
                />
            );
            }


          case "heading":
            return (
              <h3 key={i} className="text-lg font-semibold">
                {block.value}
              </h3>
            );

          case "list":
            return (
              <ul key={i} className="list-disc pl-5 text-gray-600">
                {block.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
