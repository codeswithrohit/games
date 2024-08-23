import Link from 'next/link';
import { useState } from 'react';

function NavBar() {
  const [navbar, setNavbar] = useState(false);

  return (
    <div>
      <nav className="w-full bg-blue-700 fixed top-0 left-0 right-0 z-10" style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2016/10/11/21/43/geometric-1732847_1280.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              {/* LOGO */}
              <Link href="/">
                <h2 className="text-3xl text-white font-bold ">Sattaexpert</h2>
              </Link>
              {/* HAMBURGER BUTTON FOR MOBILE */}
              <div className="md:hidden">
                <button
                  className="p-2 text-pink-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <img src="/close.svg" width={30} height={30} alt="logo" />
                  ) : (
                    <img
                      src="/hamburger-menu.svg"
                      width={30}
                      height={30}
                      alt="logo"
                      className="focus:border-none active:border-none"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? 'p-12 md:p-0 block' : 'hidden'
              }`}
            >
              <ul className="h-screen md:h-auto items-center justify-center md:flex ">
                <li className="pb-6 text-xl text-white py-2 md:px-6 text-center border-b-2 md:border-b-0   border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent font-bold mt-2">
                  <Link href="/" onClick={() => setNavbar(!navbar)}>
                    Home
                  </Link>
                </li>
                <li className="pb-6 text-xl text-white py-2 px-6 text-center  border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent font-bold mt-2">
                  <Link href="/Yearly.html" onClick={() => setNavbar(!navbar)}>
                    Yearly
                  </Link>
                </li>
                <li className="pb-6 text-xl text-white py-2 px-6 text-center  border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent font-bold mt-2">
                  <Link href="/Monthly.html" onClick={() => setNavbar(!navbar)}>
                    Monthly
                  </Link>
                </li>
                <li className="pb- text-black text-xl font-bold  py-1 px-4 text-center  border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent bg-white rounded-full ">
                  <Link href="/UserLogin.html" onClick={() => setNavbar(!navbar)}>
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
