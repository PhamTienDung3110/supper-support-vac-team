'use client'
import { Upload } from 'antd';
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons'

const ContentFile = ({ setStubContent, setFileContent, setFileName, fileName }: any) => {

  const apiCallRegex = /ApiUtils\.(post|get|delete|put)\([\s\S]*?\)/g;
  const regexApi = /`([^`]+)`/;

  const handleFileSelect = (file: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content: any = event?.target?.result;
        let match;
        const apiCalls = [];
        while ((match = apiCallRegex.exec(content)) !== null) {
          const method = match[1];
          const apiCallContent: any = regexApi?.exec(match[0])?.[1];
          apiCalls.push({ method, apiCallContent });
        }
        setStubContent(apiCalls);
        setFileName(file?.name)
        setFileContent(content)
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <Upload.Dragger
        beforeUpload={(file) => {
          handleFileSelect(file)
          return false
        }}
        showUploadList={false}
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>{ fileName || 'Chọn file coding (.vue)'}</p>
      </Upload.Dragger>
      <div>
      </div>
    </div>
  );
};

export default ContentFile;

const FileInput = ({ onFileSelect }: any) => {
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    onFileSelect(selectedFile);
  };

  return (
    <input type="file" onChange={handleFileChange} />
  );
};