import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/news/detail/$id')({
  component: RouteComponent
})

function RouteComponent() {
  // const { params } = useMatch({
  //   from: '/_app/article/detail/$id'
  // })
  return (
    <div className="mt-16 px-121px max-lg:px-20px max-xl:px-60px">
      <div className="text-6 max-lg:text-4 max-xl:text-5">马修·艾斯纳·1月16，2024</div>
      <div className="mt-25px text-50px font-600 leading-100% max-lg:mt-12px max-xl:mt-18px max-lg:text-24px max-xl:text-36px max-lg:leading-120% max-xl:leading-110%">探索金融的未来:代币化的现实世界资产</div>
      <img className="mt-65px w-full max-lg:mt-24px max-xl:mt-40px" src="/src/assets/images/feature-card.png" alt="" />
      <div className="mt-41px flex flex-col gap-41px text-6 max-lg:mt-16px max-xl:mt-28px max-lg:gap-12px max-xl:gap-24px max-lg:text-4 max-xl:text-5">
        <div>在充满活力的金融世界中，一种变革性的趋势正在出现，这种趋势模糊了传统金融方法与去中心化金融(DeFi)创新领域之间的界限。这一趋势围绕着将现实世界资产(RWA) 整合到 DeFi 中展开，标志着数字时代资产感知和处理方式的关键转变。</div>
        <div>从历史上看，RWA 一直是传统金融(Tradi)的支柱，受既定规范和实践的约束。然而，区块链技术的出现和 DeFi 的兴起为这些资产开辟了新的途径。通过将 RWA 引入 DeFi 生态系统，有可能彻底改变资产管理，使其更具包容性、流动性和效率。</div>
        <div>这种整合不仅象征着技术进步;它是对资产交互的重新定义，提供了安全性和灵活性的无缝结合。RWA 向DeFi 的迁移不仅增强了数字金融领域的能力，而且还邀请更广泛的受众参与到更加民主化的金融体系中。</div>
        <div>在这次探索中，我们将揭示 DeFi 领域 RWA 的细微差别，深入研究它们的变革性影响，并考虑这种新兴协同效应的未来轨迹。在我们进行这种整合时，我们的目标是全面了解其重要性以及它预示着金融未来带来的机遇。</div>
      </div>
    </div>
  )
}
