'use client'
import { InboxOutlined } from '@ant-design/icons'
import { Button, Table, Upload, message } from 'antd'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

interface DataItem {
  key: number
  [key: string]: any
}

const ImportExcelTc: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([])
  const [columns, setColumns] = useState<any[]>([])

  const handleFileChange = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target?.result as string, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      const headers: any = sheetData[2]
      headers.unshift('action')
      const tableColumns = headers.map((header: string) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
        width: 200
      }))

      sheetData.shift()
      setColumns(tableColumns)
      const tempSetData: any = sheetData.filter((ele) => Array.isArray(ele) && ele.length > 0)
      tempSetData.map((item: any, index: any) => {
        item.unshift(<GetText text={item} />)
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
      key: index.toString()
    }
  })

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
      {data.length > 0 && (
        <Table dataSource={dataSource} columns={columns} bordered pagination={false} scroll={{ x: 'max-content' }} />
      )}
    </div>
  )
}

export default ImportExcelTc

const GetText = (text: any) => {
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
      `No.${text.text[1]} [${text.text[2]}]: ${text.text[3]} ⇒ ${text.text[4]} ⇒ ${text.text[5]}` +
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
      <Button onClick={handleCopyClick}>{text.text[1]}</Button>
    </>
  )
}