'use client'
import { InboxOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, GetProp, Modal, Row, Table, Upload, message } from 'antd'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

interface DataItem {
  key: number
  [key: string]: any
}

const ImportExcelTc: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
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
          render: (text: string) => <div style={{ maxWidth: '500px'}}>{text}</div>,
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

  const onChangeCheckBox: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  return (
    <div>
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
            <Modal
        open={open}
        title="Render file UT"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>,
          <Button
            key="link"
            href="https://google.com"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Search on Google
          </Button>,
        ]}
      >
  <Checkbox.Group style={{ width: '100%' }} onChange={onChangeCheckBox}>
    <Row>
      <Col className='my-2' span={12}>
        <Checkbox value="GET">Method GET</Checkbox>
      </Col>
      <Col className='my-2' span={12}>
        <Checkbox value="POST">Method POST</Checkbox>
      </Col>
      <Col className='my-2' span={12}>
        <Checkbox value="PUT">Method PUT</Checkbox>
      </Col>
      <Col className='my-2' span={12}>
        <Checkbox value="DELETE">Method DELETE</Checkbox>
      </Col>
      <Col className='my-2' span={12}>
        <Checkbox value="TOAST">Toast message </Checkbox>
      </Col>
      <Col className='my-2' span={12}>
        <Checkbox value="GENGO">Tạo GENGO</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>
      </Modal>
    </div>
  )
}

export default ImportExcelTc

const GetText = (props: { text: any, index: number }) => {
  console.log('props',props)
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