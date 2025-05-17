import type { ConnectedWallet } from '@privy-io/react-auth'
import type { TableProps } from 'antd'
import { getEarningList, reciveEarnings } from '@/api/profile'
import { PaymentMethod } from '@/components/common/payment-method'
import TableComponent from '@/components/common/table-component'
import PropertyTokenABI from '@/contract/PropertyToken.json'
import RewardManagerABI from '@/contract/RewardManager.json'
import { MerkleTree } from '@/utils/merkle-tree'
import { useWallets } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { Button, Pagination } from 'antd'
import dayjs from 'dayjs'
import { ethers } from 'ethers'

export const Earnings: FC = () => {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [recivingId, setRecivingId] = useState<number[]>([])

  const pageSize = 20

  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['get-earning-list', page, pageSize],
    queryFn: async () => {
      const res = await getEarningList()

      setTotal(_get(res.data, 'count', 0))
      return _get(res.data, 'list', [])
    }
  })

  const columns: TableProps['columns'] = [
    {
      title: 'Date',
      dataIndex: 'create_date',
      render(value) {
        return (
          <div>
            {dayjs(value).format('YYYY-MM-DD')}
          </div>
        )
      }
    },
    {
      title: 'Asset',
      key: 'property_name',
      dataIndex: 'property_name'
    },
    {
      title: 'Amount',
      key: 'income_amount',
      dataIndex: 'income_amount'
    },
    {
      title: 'Tokens',
      key: 'number',
      dataIndex: 'number'
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render(value) {
        let typeName
        let typeClass
        switch (value) {
          case 0:
            typeName = t('profile.earnings.available')
            typeClass = 'text-green-6 bg-[#1e4939]'
            break
          case 1:
            typeName = t('profile.earnings.received')
            typeClass = 'text-black bg-primary'
            break
        }

        return (
          <span className={cn(
            'text-center py-1 px-2 rounded-md',
            typeClass
          )}
          >
            {typeName}
          </span>
        )
      }
    },
    {
      title: '',
      render(_, record) {
        return record.status === 0 && (
          <div>
            <Button
              size="large"
              className="w-1/2 bg-transparent! text-white! disabled:text-gray-6!"
              loading={recivingId.includes(record.id)}
              disabled={wallet?.address !== record.user_address}
              onClick={
                () => recive(
                  record.id,
                  record.distribution_id,
                  record.contract_address
                )
              }
            >
              {t('profile.earnings.receive')}
            </Button>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    if (ready) {
      const [firstWallet] = wallets
      if (firstWallet) {
        setWallet(firstWallet)
      }
    }
  }, [ready, wallets])

  async function recive(
    incomeId: number,
    distributionId: string,
    contractAddress: string
  ) {
    if (!incomeId)
      return

    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    try {
      setRecivingId(prev => [...prev, incomeId])

      // 获取 provider、signer、合约
      const ethProvider = await wallet.getEthereumProvider()
      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()

      const rewardManager = new ethers.Contract(
        RewardManagerABI.address,
        RewardManagerABI.abi,
        signer
      )
      const propertyTokenContract = new ethers.Contract(
        contractAddress,
        PropertyTokenABI.abi,
        signer
      )

      // 获取当前用户地址
      const userAddress = await signer.getAddress()

      // 获取分配信息
      const distribution = await rewardManager.getDistribution(distributionId)
      console.log('[INFO] 分配信息:', distribution)

      // 获取代币余额和总供应量
      const investorBalance = await propertyTokenContract.balanceOf(userAddress)
      const totalSupply = await propertyTokenContract.totalSupply()

      console.log('[INFO] 代币信息:')
      console.log(`- 投资者余额: ${ethers.formatUnits(investorBalance, 18)}`)
      console.log(`- 总供应量: ${ethers.formatUnits(totalSupply, 18)}`)

      // 计算可领取金额（按比例）
      const totalAmount = BigInt(distribution[8].toString())
      const eligibleAmount = (totalAmount * BigInt(investorBalance.toString())) / BigInt(totalSupply.toString())
      console.log('[INFO] 可领取金额:', ethers.formatUnits(eligibleAmount, 18))

      if (eligibleAmount === 0n) {
        toast.error(t('profile.earnings.no_eligible_amount'))
        return
      }

      // 创建默克尔树数据
      const merkleData = {
        address: userAddress,
        totalEligible: eligibleAmount
      }

      // 创建默克尔树
      const merkleTree = new MerkleTree([merkleData])
      const merkleRoot = merkleTree.getRoot()
      console.log('[INFO] 生成的默克尔根:', merkleRoot)
      console.log('[INFO] 合约中的默克尔根:', distribution[9])

      // 生成默克尔证明
      const merkleProof = merkleTree.getProof(merkleData)
      console.log('[INFO] 生成的默克尔证明:', merkleProof)

      // 8. 验证 Merkle 证明
      const isValid = await rewardManager.verifyMerkleProof(
        distributionId,
        userAddress,
        eligibleAmount,
        merkleProof
      )

      if (!isValid) {
        toast.error(t('profile.earnings.invalid_merkle_proof'))
        return
      }

      // 调用 withdraw 领取收益
      const tx = await rewardManager.withdraw(
        distributionId,
        userAddress,
        eligibleAmount,
        totalAmount,
        merkleProof
      )
      await tx.wait()

      try {
        setRecivingId(prev => [...prev, incomeId])
        await reciveEarnings({
          income_id: `${incomeId}`
        })

        toast.success(t('profile.earnings.receive_success'))
      }
      finally {
        setRecivingId(prev => prev.filter(id => id !== incomeId))
        refetch()
      }
    }
    catch (error: any) {
      console.error(error)
      toast.error(error?.message || t('profile.earnings.receive_failed'))
    }
    finally {
      setRecivingId(prev => prev.filter(id => id !== incomeId))
    }
  }

  return (
    <div className="text-white space-y-6">
      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-8"
      >
        <PaymentMethod
          walletState={[wallet, setWallet]}
        />

        <TableComponent
          columns={columns}
          data={transactionsData}
        />
      </Waiting>

      <div className="flex justify-end">
        <Pagination
          current={page}
          pageSize={20}
          total={total}
          onChange={page => setPage(page)}
          className="mt-4"
        />
      </div>
    </div>
  )
}
