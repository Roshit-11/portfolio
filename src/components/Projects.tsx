import React from 'react';
import { ExternalLink, Github, ShoppingCart, Dumbbell, Cpu } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Wristy - E-commerce Watch Website",
      description: "Designed and developed a luxury-themed e-commerce platform for watch reselling. Enhanced user experience with elegant UI, seamless navigation, and advanced web technologies ensuring scalability and optimal performance.",
      icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
      technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      category: "Web Development",
      type: "Group Coursework",
      institution: "Islington College",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Gym Management System",
      description: "Comprehensive gym management system using Object-Oriented Programming principles in Java. Features different membership plans, attendance tracking, loyalty points, and a graphical user interface for seamless user experience.",
      icon: <Dumbbell className="w-8 h-8 text-green-600" />,
      technologies: ["Java", "OOP", "GUI", "ArrayList"],
      category: "Software Development",
      type: "Programming Coursework",
      institution: "Islington College",
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "Smart Farming IoT System",
      description: "IoT-based smart farming system that automates irrigation, monitors environmental conditions, and provides real-time alerts. Integrates machine learning for disease detection and uses ESP32 with Blynk for optimal resource management.",
      icon: <Cpu className="w-8 h-8 text-orange-600" />,
      technologies: ["ESP32", "Blynk", "Machine Learning", "IoT", "Sensors"],
      category: "IoT & Machine Learning",
      type: "Current Project",
      institution: "Islington College",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore my journey through various projects that showcase my passion for web development, 
            software engineering, and emerging technologies like IoT and machine learning.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${project.color}`}></div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {project.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {project.type}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Category:</span>
                    <span className="text-sm text-gray-600 ml-2">{project.category}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Institution:</span>
                    <span className="text-sm text-gray-600 ml-2">{project.institution}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                    <span className="mr-2">Learn More</span>
                    <ExternalLink size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">More Projects Coming Soon</h3>
              <p className="text-gray-600 max-w-md">
                I'm constantly working on new projects and exploring emerging technologies. 
                Stay tuned for more exciting developments!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;