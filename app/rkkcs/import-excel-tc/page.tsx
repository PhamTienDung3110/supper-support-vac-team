'use client'
import { getStubMethod, getToastStub } from '@/utils'
import { InboxOutlined } from '@ant-design/icons'
import { Button, Table, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import ContentFile from './components/ContentVueFile'

interface DataItem {
  key: number
  [key: string]: any
}

const ImportExcelTc: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [stubContent, setStubContent] = useState([]);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [dataFileExcel, setDataFileExcel] = useState([]);
  const [itList, setListIt] = useState('');

  const [textStub, setTextStub] = useState({
    createStub: '',
    createStubPost: '',
    createStubPut: '',
    createStubDelete: '',
  });
  const [textToast, setTextToast] = useState({
    defineToast: '',
    resetToast: '',
  });

  useEffect(() => {
    if (fileContent !== '') {
      const { createStub, createStubPost, createStubPut, createStubDelete } = getStubMethod(stubContent)
      const { defineToast, resetToast } = getToastStub(fileContent)

      setTextStub({ createStub, createStubPost, createStubPut, createStubDelete })
      setTextToast({ defineToast, resetToast })
      if (dataFileExcel.length > 0) {
        let listIt = ''
        dataFileExcel?.map((item: any, index: number) => {
          if (index > 1) {
            const textClipboard =
              'it(' +
              '`' +
              `No.${item[1]} [${item[2]}]: ${item[3]} ⇒ ${item[4]} ⇒ ${item[5]}` +
              '`, async () => {' + '\n' +
              `${createStub ? 'const stub = createStub();' : ''}` + '\n' +
              `${createStubPost ? 'const stubPost = createStubPost();' : ''}` + '\n' +
              `${createStubPut ? 'const stubPut = createStubPut();' : ''}` + '\n' +
              `${createStubDelete ? 'const stubDelete = createStubDelete();' : ''}` + '\n' +
              `setSessionStorageStubs(AuthorityConstant.SE_AUTH_NO);
          const wrapper = componentMount();
          await flushPromises();
          try {
            await wrapper.vm.$nextTick(async () => {` + '\n' +
              `});
          } finally {
            wrapper.unmount();` + '\n' +
              `${createStub ? 'stub.restore();' : ''}` + '\n' +
              `${createStubPost ? 'stubPost.restore();' : ''}` + '\n' +
              `${createStubPut ? 'stubPut.restore();' : ''}` + '\n' +
              `${createStubDelete ? 'stubDelete.restore();' : ''}` + '\n' +
              `restoreSessionStorageStubs();
          }
        });`
            listIt = listIt + '\n' + '\n' + textClipboard
          }
        })
        setListIt(listIt)
        renderFile()
      } else {
        alert('pls enter UT file')
      }
    } else {
      return
    }
  }, [fileContent, dataFileExcel])

  const renderFile = () => {
    const output = `
    describe('${fileName}', () => {
      const sandbox = sinon.createSandbox();
      const componentMount = () => {
        const global = {
          components: {
            Column,
          },
          plugins: [rkkcsPlugin],
          stubs: [],
        };
        rkkcsPlugin.installed = false;
        return mount(${fileName.replace('.vue', '')}, {
          global,
        });
      };
      ${textToast?.defineToast}

      ${textStub.createStub}

      ${textStub.createStubPost}

      ${textStub.createStubPut}

      ${textStub.createStubDelete}

      afterEach(() => {
        sandbox.restore();
        ${textToast?.resetToast}
        sinon.restore();
      });

      ${itList}
    });
    `

    console.log('output',output)
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleFileChange = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target?.result as string, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      const tableColumns = [
        {
          title: 'action',
          dataIndex: 'action',
          key: 'action',
          editable: true,
          width: 100
        },
        {
          title: 'No3:53:4',
          dataIndex: 'No3:53:4',
          key: 'No3:53:4',
          editable: true,
          width: 100
        },
        {
          title: 'Pattern',
          dataIndex: 'Pattern',
          key: 'Pattern',
          editable: true,
          width: 100
        },
        {
          title: 'TestCase',
          dataIndex: 'TestCase',
          key: 'TestCase',
          editable: true,
          width: 250
        },
        {
          title: 'Input',
          dataIndex: 'Input',
          key: 'Input',
          editable: true,
          width: 100,
          render: (text: string) => <div style={{ maxWidth: '500px' }}>{text}</div>,
        },
        {
          title: 'Output',
          dataIndex: 'Output',
          key: 'Output',
          editable: true,
          width: 150
        },
        {
          title: 'Resource',
          dataIndex: 'Resource',
          key: 'Resource',
          editable: true,
          width: 100
        },
      ]

      sheetData.shift()
      setColumns(tableColumns)
      const tempSetData: any = sheetData.filter((ele) => Array.isArray(ele) && ele.length > 0)
      console.log('tempSetData', tempSetData)
      setDataFileExcel(tempSetData)
      tempSetData.map((item: any, index: number) => {
        item.unshift(<GetText text={item} index={index} />)
        return { ...item, key: index }
      })
      setData(tempSetData)
    }

    reader.readAsBinaryString(file)
  }

  const dataSource = data.map((row: any, index) => {
    const rowData: any = {}
    columns.forEach((column, columnIndex) => {
      rowData[column.key] = row[columnIndex]
    })
    return {
      ...rowData,
      key: index.toString(),
    }
  })

  return (
    <div>
      <ContentFile setStubContent={setStubContent} setFileContent={setFileContent} setFileName={setFileName} />
      <Upload.Dragger
        beforeUpload={(file) => {
          handleFileChange(file)
          return false
        }}
        showUploadList={false}
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click or drag file to this area to upload</p>
      </Upload.Dragger>
      <div className='text-center	'>
        {data.length > 0 && <Button className='font-bold my-3' onClick={showModal}>Render file UT</Button>}
      </div>
      {data.length > 0 && (
        <Table dataSource={dataSource} columns={columns} bordered pagination={false} scroll={{ x: 'max-content' }} />
      )}
    </div>
  )
}

export default ImportExcelTc

const GetText = (props: { text: any, index: number }) => {
  const { text, index } = props;
  const [messageApi, contextHolder] = message.useMessage()

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message'
    })
  }

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message'
    })
  }
  const handleCopyClick = async () => {
    const textClipboard =
      'it(' +
      '`' +
      `No.${text[1]} [${text[2]}]: ${text[3]} ⇒ ${text[4]} ⇒ ${text[5]}` +
      '`, async () => {'
    try {
      await navigator.clipboard.writeText(textClipboard)
      success()
    } catch (err) {
      error()
    }
  }

  return (
    <>
      {contextHolder}
      {index > 1 ? <Button onClick={handleCopyClick}>{'it.No' + text[1]}</Button> : <></>}
    </>
  )
}