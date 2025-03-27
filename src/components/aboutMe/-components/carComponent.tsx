import { useState } from 'react'
import './css/carComponent.scss'

// 卡片组件
function CarComponent() {
  const [carList] = useState([
    {
      title: 'Toyota Camry',
      field: '¥ 89,432,150,000',
      fieldTwo: '+2.5%',
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'Toyota Balance',
      field: '1,245',
      fieldTwo: '≈ ¥8,526,450.00',
      picture: '',
      color: '#8d909a'
    },

    {
      title: 'Monthly Rental Income(JPY)',
      field: '¥ 42,150.00',
      fieldTwo: 'vs last month +1.2%',
      picture: new URL('@/assets/icons/arrow-up.png', import.meta.url).href,
      color: '#2bb480'
    },

    {
      title: 'Annual Yield',
      field: '5.8%',
      fieldTwo: 'Industry avg. 4.2%',
      picture: '',
      color: '#8d909a'
    }
  ])

  return (
    <div className="carComponent-wrap">
      { carList.map(item => (
        <div key={item.title} className="box-wrap">
          <div className="box-item text-[#8d909a]">{item.title}</div>
          <div className="box-item font-size-4 font-bold">{item.field}</div>
          <div className="box-item flex items-center justify-start">
            {item.picture && (
              <img src={item.picture} alt="" className="h-3 w-3" />
            )}
            <span style={{ color: item.color }}>{item.fieldTwo}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CarComponent
