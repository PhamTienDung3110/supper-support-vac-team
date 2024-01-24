'use client'
import { getStubMethod, getToastStub } from '@/utils'
import { InboxOutlined } from '@ant-design/icons'
import { Button, Modal, Radio, RadioChangeEvent, Space, Table, Upload, message } from 'antd'
import React, { ChangeEvent, useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import ContentFile from './components/ContentVueFile'
import TextArea from 'antd/es/input/TextArea'
interface DataItem {
  key: number
  [key: string]: any
}

const ImportExcelTc: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [stubContent, setStubContent] = useState([]);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileNameExcel, setFileNameExcel] = useState('');
  const [dataFileExcel, setDataFileExcel] = useState([]);
  const [itList, setListIt] = useState('');
  const [textData, setTextData] = useState('');
  const [isPage, setIsPage] = useState<boolean>();
  const [visibleDonate, setVisibleDonate] = useState<boolean>(false);

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
              `${createStub ? 'const stub = createGetStub();' : ''}` + '\n' +
              `${createStubPost ? 'const stubPost = createPostStub();' : ''}` + '\n' +
              `${createStubPut ? 'const stubPut = createPutStub();' : ''}` + '\n' +
              `${createStubDelete ? 'const stubDelete = createDeleteStub();' : ''}` + '\n' +
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
      } else { }
    } else {
      return
    }
  }, [fileContent, dataFileExcel])

  useEffect(() => {
    const interval = setInterval(() => {
      // Hiển thị Modal mỗi 30 giây
      setVisibleDonate(true)
    }, 30000);

    return () => clearInterval(interval); // Hủy vòng lặp khi component unmount
  }, []);

  const renderFile = async () => {
    const output = `
    import ${fileName.replace('.vue', '')} from "@/${isPage ? 'pages' : 'components/organisms'}/${fileName}";
    import { ApiUtils, SessionKey, SessionStorageUtils, ToastMessageUtils, rkkcsPlugin } from "@kuhonji/common-control-v4";
    import { flushPromises, mount } from "@vue/test-utils";
    import sinon from "sinon";
    import sessionStorageMock from "tests/utils/sessionStorageMock";
    import Column from "primevue/column";
    import { TestUtils } from "tests/utils/testUtils";
    import { PathConstant } from "@kuhonji/ah_v4";
    import { AuthorityConstant } from "@/utils/raAuthorityConstant";

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

      global.sessionStorage = sessionStorageMock();
      let sessionStorageStub: sinon.SinonStub;
      let sessionStorageUtilsStub: sinon.SinonStub;

      ${textData}

      const restoreSessionStorageStubs = () => {
        sessionStorageStub?.restore();
        sessionStorageUtilsStub?.restore();
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

    try {
      await navigator.clipboard.writeText(output)
      alert('Đã copy thành công')
    } catch (err) {
      alert(err)
    }
  }

  const handleFileChange = (file: File) => {
    setFileNameExcel(file?.name)
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
      <ContentFile setStubContent={setStubContent} setFileContent={setFileContent} setFileName={setFileName} fileName={fileName} />
      <div className='flex my-4'>
        <TextArea
          className='w-2/4'
          placeholder="Enter function get auth (setSessionStorageStubs)"
          value={textData}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextData(e.target.value)}
        />
        <Radio.Group className='ml-5' onChange={(e: RadioChangeEvent) => setIsPage(e.target.value)} value={isPage}>
          <Space direction="vertical">
            <Radio value={0}>Component</Radio>
            <Radio value={1}>Page</Radio>
          </Space>
        </Radio.Group>
      </div>
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
        <p className='ant-upload-text'>{fileNameExcel || 'Chọn file excel UT (.xlsx)'}</p>
      </Upload.Dragger>
      <div className='text-center	'>
        {data.length > 0 && <Button disabled={!textData || !dataFileExcel || !fileContent || isPage == null} className='font-bold my-3' onClick={() => renderFile()}>Render file UT</Button>}
      </div>
      {data.length > 0 && (
        <Table dataSource={dataSource} columns={columns} bordered pagination={false} scroll={{ x: 'max-content' }} />
      )}
      <Modal
        title="Ủng hộ tác giả"
        open={visibleDonate}
        onCancel={() => setVisibleDonate(false)}
        footer={null}
      >
        <div>
          <p>Hãy ủng hộ tác giả để có thể ra được những sản phẩm mới!!!!!!!</p>
          <img src="/donate.jpg" />
        </div>
      </Modal>
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