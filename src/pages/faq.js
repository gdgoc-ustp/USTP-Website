import { useState } from "react";
import NavigationBar from "../components/navBar";
import ContentRenderer from "../components/ContentRenderer";
import { faqs } from "../data/faqs";

export default function FaQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <>
      <title>FAQs</title>
      <NavigationBar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 font-sans">
          Solution Challenge FAQs
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const open = openIndex === i;

            return (
              <div
                key={i}
                className="border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex justify-between items-center p-5 text-left text-lg hover:bg-gray-50 transition-colors font-bold font-sans tracking-wide text-gray-800"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`transform transition-transform duration-300 text-gray-500 ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ⌄
                  </span>
                </button>

                <div
                  style={{
                    maxHeight: open ? "1000px" : "0px",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(-10px)",
                  }}
                  className="transition-all duration-500 ease-in-out overflow-hidden px-5"
                >
                  <div className="py-5">
                    <ContentRenderer blocks={faq.content} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
