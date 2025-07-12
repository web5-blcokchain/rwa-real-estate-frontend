import type { TableProps } from 'antd'
import { Empty, Table } from 'antd'
import React from 'react'

import './styles.scss'

interface TableComponentProps<T> {
  children?: React.ReactNode
  titleSlot?: React.ReactNode
  columns: TableProps<T>['columns']
  data: T[]
}

function TableComponent<T extends object>({ children, titleSlot, columns, data }: TableComponentProps<T>) {
  const { t } = useTranslation()
  return (
    <div className="mt-8 rounded-xl bg-[#202329] p-5 text-white">
      {children}
      {titleSlot}
      <Table<T>
        scroll={{ x: 'max-content' }}
        className="custom-table"
        columns={columns}
        dataSource={data}
        rowClassName={() => 'custom-table-row'}
        pagination={false}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description=""><div className="text-white">{t('common.no_data')}</div></Empty> }}
      >

      </Table>
    </div>
  )
}

export default TableComponent
