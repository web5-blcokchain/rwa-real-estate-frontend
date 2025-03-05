export default function MainFooter() {
  return (
    <footer className="mt-32 bg-[#1e2024] px-8 py-14">
      <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
        <div>
          <div className="text-4.5 text-[#898989]">About</div>
          <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2">
            <li>Company</li>
            <li>Careers</li>
            <li>News</li>
          </ul>
        </div>

        <div>
          <div className="text-4.5 text-[#898989]">Products</div>
          <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2">
            <li>Properties</li>
            <li>Token Market</li>
            <li>DeFi Services</li>
          </ul>
        </div>

        <div>
          <div className="text-4.5 text-[#898989]">Support</div>
          <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Legal</li>
          </ul>
        </div>

        <div>
          <div className="text-4.5 text-[#898989]">Follow Us</div>
          <div className="mt-4 fyc gap-2 text-text">
            <div className="i-mdi-twitter size-5"></div>
            <div className="i-mdi-linkedin size-5"></div>
            <div className="i-ic-baseline-telegram size-5"></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
