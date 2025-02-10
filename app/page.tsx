"use client";

import { useState, useEffect } from 'react';

const TemplateForm = () => {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    linkedin: '',
    github: '',
    outputFilename: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch available templates
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

    // Map form data to placeholder values
    const placeholderValues = {
      'Place_Holder_Name': formData.name,
      'Place_Holder_contact': formData.contact,
      'Place_Holder_Mail': formData.email,
      'Place_Holder_linkedin': formData.linkedin,
      'Place_Holder_github': formData.github
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
      if (response.ok) {
        setStatus('PDF generated successfully!');
      } else {
        setStatus(`Error: ${data.detail}`);
      }
    } catch (error) {
      setStatus('Error generating PDF');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resume Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Selection */}
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
                <option key={id} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          {/* Name */}
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

          {/* Contact */}
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

          {/* Email */}
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

          {/* LinkedIn */}
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

          {/* GitHub */}
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
        </div>

        {/* Output Filename */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
          disabled={!selectedTemplate || !formData.outputFilename}
        >
          Generate Resume PDF
        </button>

        {/* Status Message */}
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
    </div>
  );
};

export default TemplateForm;