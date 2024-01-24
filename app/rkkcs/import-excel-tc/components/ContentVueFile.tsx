'use client'
import React, { useState } from 'react';

const ContentFile = ({setStubContent, setFileContent, setFileName}: any) => {

  const apiCallRegex = /ApiUtils\.(post|get|delete|put)\([\s\S]*?\)/g;
  const regexApi = /`([^`]+)`/;

  const handleFileSelect = (file:any) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content:any = event?.target?.result;
        let match;
        const apiCalls = [];
        while ((match = apiCallRegex.exec(content)) !== null) {
          const method = match[1];
          const apiCallContent:any = regexApi?.exec(match[0])?.[1];
          apiCalls.push({ method, apiCallContent});
        }
        console.log('api calls', apiCalls)
        setStubContent(apiCalls);
        setFileName(file?.name)
        setFileContent(content)
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <FileInput onFileSelect={handleFileSelect} />
      <div>
        <strong>File Content:</strong>
      </div>
    </div>
  );
};

export default ContentFile;

const FileInput = ({ onFileSelect }:any) => {
  const handleFileChange = (event:any) => {
    const selectedFile = event.target.files[0];
    onFileSelect(selectedFile);
  };

  return (
    <input type="file" onChange={handleFileChange} />
  );
};