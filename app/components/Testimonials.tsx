const testimonials = [
  {
    quote:
      "Varun consistently delivers technically excellent solutions and brings a strategic mindset to every challenge. His ability to reduce infrastructure costs while maintaining performance is remarkable.",
    name: "Engineering Lead",
    role: "iDream Education",
  },
  {
    quote:
      "Working with Varun on Project RISL was exceptional. He architected a complex hybrid Edge-Cloud system that exceeded all requirements for the government digital library initiative.",
    name: "Product Manager",
    role: "iDream Education",
  },
  {
    quote:
      "Varun's Flutter expertise was instrumental in scaling our mobile app to 60,000+ downloads. His deep knowledge of BLOC architecture and focus on performance set the gold standard for our team.",
    name: "Tech Lead",
    role: "iDream Education",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-black mb-12">My Testimonial</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`p-6 flex flex-col justify-between ${
                i === 1 ? "bg-black text-white" : "bg-white border border-gray-200"
              }`}
            >
              <p
                className={`text-sm font-light leading-relaxed mb-8 ${
                  i === 1 ? "text-gray-300" : "text-gray-600"
                }`}
              >
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    i === 1 ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${i === 1 ? "text-white" : "text-black"}`}>
                    {t.name}
                  </p>
                  <p className={`text-xs font-light mt-0.5 ${i === 1 ? "text-gray-400" : "text-gray-500"}`}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
