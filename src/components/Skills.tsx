import React from 'react';
import { Award, Code, Database, Cloud, Zap, Users } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      icon: <Code className="w-8 h-8 text-blue-600" />,
      title: "Programming Languages",
      skills: ["JavaScript", "Java", "Python", "HTML/CSS"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Web Technologies",
      skills: ["Responsive Design", "UI/UX Design", "Modern CSS", "Web Performance"],
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Database className="w-8 h-8 text-green-600" />,
      title: "Databases & Backend",
      skills: ["SQL", "Data Structures", "OOP Concepts", "System Design"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Cloud className="w-8 h-8 text-purple-600" />,
      title: "Cloud & DevOps",
      skills: ["AWS Cloud", "Machine Learning", "IoT Development", "ESP32"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  const certifications = [
    {
      title: "AWS Academy Cloud Foundations",
      issuer: "AWS Academy",
      year: "2024",
      category: "Cloud Computing"
    },
    {
      title: "AWS Academy Machine Learning Foundations",
      issuer: "AWS Academy", 
      year: "2024",
      category: "Machine Learning"
    },
    {
      title: "AWS Academy ML for Natural Language Processing",
      issuer: "AWS Academy",
      year: "2024",
      category: "AI/ML"
    },
    {
      title: "Global Professional Pathway Course",
      issuer: "ING Skill Academy",
      year: "2024",
      category: "Professional Development"
    },
    {
      title: "Foundation of Python - Basic Essential Training",
      issuer: "LinkedIn Learning",
      year: "2025",
      category: "Programming"
    },
    {
      title: "Foundation of NumPy",
      issuer: "LinkedIn Learning",
      year: "2025",
      category: "Data Science"
    },
    {
      title: "Java, Object Oriented Programming",
      issuer: "LinkedIn Learning",
      year: "2025",
      category: "Programming"
    }
  ];

  return (
    <section id="skills" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of my technical skills, certifications, and areas of expertise 
            developed through academic coursework and hands-on projects.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="transform group-hover:scale-110 transition-transform duration-300 mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
              </div>
              
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} mr-3`}></div>
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-blue-600 mr-4" />
              <h3 className="text-3xl font-bold text-gray-900">Certifications</h3>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Continuous learning through industry-recognized certifications and professional development courses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 leading-tight">{cert.title}</h4>
                    <p className="text-blue-600 font-medium text-sm">{cert.issuer}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {cert.year}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                    {cert.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Achievement */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-8 bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl text-white">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">Academic Excellence</h3>
              </div>
              <p className="text-blue-100 max-w-md">
                Maintained a strong academic record with GPA 3.78 while actively participating in 
                college projects and leadership programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;