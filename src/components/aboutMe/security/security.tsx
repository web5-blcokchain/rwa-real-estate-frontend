import type { ProgressProps } from 'antd'
import authentication from '@/assets/icons/authentication.png'
import checkActive from '@/assets/icons/check-active.png'
import checkGrey from '@/assets/icons/check-grey.png'
import management from '@/assets/icons/management.png'
import menu from '@/assets/icons/menu.png'
import notifications from '@/assets/icons/notifications.png'
import password from '@/assets/icons/password.png'
import pin from '@/assets/icons/pin.png'
import { Button, Progress, Switch } from 'antd'
import { useState } from 'react'

import { TitleCard } from '../-components/titleCard'

function Security() {
  const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#87d068',
    '50%': '#ffe58f',
    '100%': '#ffccc7'
  }

  // check切换
  const [checkList, setCheckList] = useState([
    { title: 'Enable 2FA Authentication', active: false },
    { title: 'Set up withdrawal whitelist', active: false },
    { title: 'Complete advanced verification', active: false }
  ])

  const toggleActive = (index: number) => {
    setCheckList(prevList => prevList.map((item, idx) =>
      idx === index ? { ...item, active: !item.active } : item
    ))
  }

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`)
  }

  const list = [
    {
      title: 'KYC Status',
      amount: 'In Progress',
      percent: 20,
      total: 'Budget ¥170'
    }
  ]

  return (
    <div className="flex justify-start text-white">
      <div className="mr-3 w-1/2">
        <TitleCard title="Security Score">
          <div className="flex justify-between pt-6">
            <div className="w-1/2">
              <Progress type="dashboard" percent={93} strokeColor={conicColors} />
            </div>
            <div className="w-1/2 flex flex-col items-start justify-start">
              <div className="text-4">Security Suggestions</div>

              {
                checkList.map((item, index) => (
                  <div key={item.title} className="mt-2 flex items-center justify-start text-[#8d909a]">
                    <img src={item.active ? checkActive : checkGrey} alt="" className="mr-1 h-3.2 w-3.2" onClick={() => toggleActive(index)} />
                    <div>{item.title}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </TitleCard>

        <TitleCard title="Login Security" className="mt-6">
          <div>
            <div className="jusitfy-between flex rounded-xl bg-[#242933] p-4">
              <div className="flex flex-grow items-center justify-start">
                <img src={authentication} alt="" />
                <div className="ml-2">
                  <div>2FA Authentication</div>
                  <div className="text-[#8d909a]">Protect your account with 2FA</div>
                </div>
              </div>
              <div className="w-12">
                <Switch defaultChecked onChange={onChange} />
              </div>
            </div>

            <div className="jusitfy-between mt-4 flex rounded-xl bg-[#242933] p-4">
              <div className="flex flex-grow items-center justify-start">
                <img src={password} alt="" />
                <div className="ml-2">
                  <div>Change Password</div>
                  <div className="text-[#8d909a]">Last changed 30 days ago</div>
                </div>
              </div>
              <div className="w-20">
                <Button
                  size="middle"
                  className="border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
                >
                  Change
                </Button>
              </div>
            </div>

            <div className="jusitfy-between mt-4 flex rounded-xl bg-[#242933] p-4">
              <div className="flex flex-grow items-center justify-start">
                <img src={management} alt="" />
                <div className="ml-2">
                  <div>Device Management</div>
                  <div className="text-[#8d909a]">3 devices currently active</div>
                </div>
              </div>
              <div className="w-20">
                <Button
                  size="middle"
                  className="border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
        </TitleCard>
      </div>

      <div className="ml-3 w-1/2">
        <TitleCard title="Identity Verification">
          <div>
            {
              list.map(item => (
                <div key={item.title} className="mb-6 flex flex-col">
                  <div className="flex justify-between text-[#8d909a]">
                    <div>Income</div>
                    <div>¥0 Received</div>
                  </div>
                  <div>
                    <Progress percent={item.percent} status="active" showInfo={false} strokeColor="#b5b5b5" trailColor="#fff" />
                  </div>
                  <div className="text-right text-[#8d909a]">Budget ¥170</div>
                </div>
              ))
            }
          </div>
        </TitleCard>

        <TitleCard title="Asset Security" className="mt-6">
          <div>
            <div className="jusitfy-between flex rounded-xl bg-[#242933] p-4">
              <div className="flex flex-grow items-center justify-start">
                <img src={pin} alt="" />
                <div className="ml-2">
                  <div>Withdrawal PIN</div>
                  <div className="text-[#8d909a]">Required for withdrawals</div>
                </div>
              </div>
              <div className="w-20">
                <Button
                  size="middle"
                  className="border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
                >
                  Set PIN
                </Button>
              </div>
            </div>

            <div className="jusitfy-between mt-4 flex rounded-xl bg-[#242933] p-4">
              <div className="flex flex-grow items-center justify-start">
                <img src={menu} alt="" />
                <div className="ml-2">
                  <div>Whitelist Management</div>
                  <div className="text-[#8d909a]">2 addresses whitelisted</div>
                </div>
              </div>
              <div className="w-20">
                <Button
                  size="middle"
                  className="border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
                >
                  Manage
                </Button>
              </div>
            </div>

            <div className="jusitfy-between mt-4 flex rounded-xl bg-[#242933] p-4">
              <div className="flex flex-grow items-center justify-start">
                <img src={notifications} alt="" />
                <div className="ml-2">
                  <div>Security Notifications</div>
                  <div className="text-[#8d909a]">Email and SMS alerts</div>
                </div>
              </div>
              <div className="w-20">
                <Button
                  size="middle"
                  className="border-[#9e9e9e] bg-[#202329] text-[#9e9e9e]!"
                >
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </TitleCard>
      </div>
    </div>
  )
}

export default Security
