import type { TablePaginationConfig, TableProps } from 'antd'
import { Empty, Table } from 'antd'
import React from 'react'

import './styles.scss'

interface TableComponentProps<T> {
  children?: React.ReactNode
  titleSlot?: React.ReactNode
  columns: TableProps<T>['columns']
  data: T[]
  pagination?: false | TablePaginationConfig
  loading?: boolean
}

function TableComponent<T extends object>({ children, titleSlot, columns, data, pagination = false, loading = false }: TableComponentProps<T>) {
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
        pagination={pagination}
        loading={loading}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description=""><div className="text-white">{t('common.no_data')}</div></Empty> }}
      >

      </Table>
    </div>
  )
}

export default TableComponent
