'use client';

import { useState, useCallback } from 'react';
import mammoth from 'mammoth';
import DOMPurify from 'dompurify';

export default function WordNews() {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert the .docx to HTML
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setContent(result.value);
      
      // Handle any warnings
      if (result.messages.length > 0) {
        console.warn('Conversion warnings:', result.messages);
      }
      
      setError('');
    } catch (err) {
      setError('Error reading file: ' + (err instanceof Error ? err.message : String(err)));
      setContent('');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Word Document Viewer</h1>
        
        {/* File upload section */}
        <div className="mb-6">
          <label 
            htmlFor="docx-upload" 
            className="block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-gray-600">Upload a .docx file</span>
            <input
              id="docx-upload"
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
      </div>

      {/* Document content */}
      {content && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div 
            className="prose max-w-none text-black"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        </div>
      )}
    </div>
  );
} 
 