import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Tech Mahindra",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      text: "CitiChain's OneKYC saved me hours of paperwork when switching banks. The ZK privacy features give me confidence that my data is secure.",
    },
    {
      name: "Rajesh Kumar",
      role: "Small Business Owner",
      company: "Kumar Enterprises",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      text: "RupeeX transactions are lightning fast! My business payments are now instant, and the smart loan feature helped me expand without traditional banking delays.",
    },
    {
      name: "Dr. Anita Patel",
      role: "Medical Professional",
      company: "Apollo Hospitals",
      image: "https://randomuser.me/api/portraits/women/67.jpg",
      rating: 5,
      text: "The Reputation Passport is revolutionary. My financial history follows me seamlessly across banks, and CitiGPT provides excellent investment advice.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how CitiChain is transforming financial experiences for
            millions of users across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
