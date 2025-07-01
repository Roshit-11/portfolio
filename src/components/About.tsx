import React from 'react';
import { Code, Brain, Smartphone, Users } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: <Code className="w-8 h-8 text-blue-600" />,
      title: "Web Development",
      description: "Passionate about creating elegant, responsive web applications using modern technologies"
    },
    {
      icon: <Brain className="w-8 h-8 text-orange-600" />,
      title: "AI & Machine Learning",
      description: "Currently pursuing B.Sc. Hons in Computing with AI, exploring the future of technology"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      title: "IoT Projects",
      description: "Developing smart farming systems with ESP32 and integrating machine learning"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Leadership",
      description: "Led programs and managed social media for Bhuryang Group, demonstrating leadership skills"
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A passionate and innovative web development enthusiast from Kathmandu, Nepal. 
            I'm continuously expanding my skills and exploring the intersection of web development and artificial intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">My Journey</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Currently pursuing my Bachelor's degree in Computing with AI at Islington College, 
                I'm fascinated by the endless possibilities that technology offers. My academic journey 
                has been marked by consistent excellence, maintaining a strong GPA while actively 
                engaging in various projects and leadership roles.
              </p>
              <p>
                From developing e-commerce platforms to creating IoT-based smart farming systems, 
                I enjoy tackling complex problems and turning ideas into reality. My experience as 
                a social media handler has also honed my communication and digital marketing skills.
              </p>
              <p>
                I believe in continuous learning and have earned multiple AWS certifications, 
                demonstrating my commitment to staying current with industry trends and technologies.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-blue-600 to-orange-600 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-6">Quick Facts</h4>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Location:</span> New Baneswor, Kathmandu
                </div>
                <div>
                  <span className="font-semibold">Education:</span> B.Sc. Hons in Computing with AI
                </div>
                <div>
                  <span className="font-semibold">Interests:</span> Web Dev, AI/ML, IoT
                </div>
                <div>
                  <span className="font-semibold">Languages:</span> Java, JavaScript, Python
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-200 to-orange-200 rounded-2xl -z-10"></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;