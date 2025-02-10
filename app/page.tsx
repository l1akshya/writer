"use client";

import { useState, useEffect } from 'react';

export default function TemplateForm() {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    linkedin: '',
    github: '',
    education: '',
    course: '',
    location: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    outputFilename: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        setStatus('Error loading templates');
      }
    };
    fetchTemplates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Generating PDF...');

    const placeholderValues = {
      'Place_Holder_Name': formData.name,
      'Place_Holder_contact': formData.contact,
      'Place_Holder_Mail': formData.email,
      'Place_Holder_linkedin': formData.linkedin,
      'Place_Holder_github': formData.github,
      'PlaceHolderEducation': formData.education,
      'PlaceHolderCourse': formData.course,
      'PlaceHolderLocation1': formData.location,
      'PlaceHolderStartMonth': formData.startMonth,
      'PlaceHolderStartYear': formData.startYear,
      'PlaceHolderEndMonth': formData.endMonth,
      'PlaceHolderEndYear': formData.endYear
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_name: selectedTemplate,
          placeholder_values: placeholderValues,
          output_filename: formData.outputFilename,
        }),
      });

      const data = await response.json();
      setStatus(response.ok ? 'PDF generated successfully!' : `Error: ${data.detail}`);
    } catch (error) {
      setStatus('Error generating PDF');
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resume Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Template:
            <select 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="">Choose a template</option>
              {Object.entries(templates).map(([id, name]) => (
                <option key={id} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                placeholder="John Doe"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Number:
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                placeholder="+1 234 567 8900"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                placeholder="john.doe@example.com"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              LinkedIn Profile:
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                placeholder="https://linkedin.com/in/johndoe"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              GitHub Profile:
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                placeholder="https://github.com/johndoe"
              />
            </label>
          </div>

          <div className="bg-white p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold mb-2">Education Details</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Educational Institute:
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                  required
                  placeholder="Harvard University"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Course:
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                  required
                  placeholder="Bachelors in Engineering"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Institute Location:
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                  required
                  placeholder="Massachusetts"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Month:
                  <input
                    type="text"
                    name="startMonth"
                    value={formData.startMonth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                    placeholder="September"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Year:
                  <input
                    type="text"
                    name="startYear"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                    placeholder="2020"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Month:
                  <input
                    type="text"
                    name="endMonth"
                    value={formData.endMonth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                    placeholder="May"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Year:
                  <input
                    type="text"
                    name="endYear"
                    value={formData.endYear}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                    placeholder="2024"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Output Filename:
            <input
              type="text"
              name="outputFilename"
              value={formData.outputFilename}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
              placeholder="my-resume"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
          disabled={!selectedTemplate || !formData.outputFilename}
        >
          Generate Resume PDF
        </button>

        {status && (
          <div className={`mt-4 p-4 rounded-md ${
            status.includes('Error') 
              ? 'bg-red-100 text-red-700 border border-red-400' 
              : 'bg-green-100 text-green-700 border border-green-400'
          }`}>
            {status}
          </div>
        )}
      </form>
    </main>
  );
}