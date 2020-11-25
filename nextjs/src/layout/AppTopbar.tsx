import { useState } from "react";
import Link from "next/link";
import ActiveLink from "../components/ActiveLink";
import { Transition } from "@tailwindui/react";
import OutsideClick from "../components/OutsideClick";

export const AppTopbar = (props) => {
  const { setOverlayMenuActive, overlayMenuActive } = props;

  const [userMenu, setUserMenu] = useState(false);

  return (
    <nav className="bg-ccd-primary-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center ">
              {/* Mobile menu button --> */}
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-xl text-white hover:text-white hover:bg-ccd-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
                onClick={() => setOverlayMenuActive(!overlayMenuActive)}
              >
                <span className="sr-only">Open main menu</span>
                {!overlayMenuActive ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a>
                  <svg
                    className="block h-12 w-12"
                    viewBox="0 0 1000 1000"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M566.241 877.875L570.634 892.596L604.348 859.321L566.241 877.875Z"
                      fill="#FEE18A"
                    />
                    <path
                      d="M636.788 843.543L604.348 859.322L570.634 892.596L576.541 912.537L645.145 844.849L636.788 843.543Z"
                      fill="#F3F095"
                    />
                    <path
                      d="M666.367 848.064L645.144 844.849L576.455 912.214L582.248 931.225L666.367 848.064Z"
                      fill="#55C1AE"
                    />
                    <path
                      d="M688.303 851.491L666.367 848.064L582.248 931.225L588.105 950.852L688.303 851.491Z"
                      fill="#88AEDC"
                    />
                    <path
                      d="M710.238 854.919L688.302 851.492L588.105 950.853L591.334 962.544L599.891 965.101L710.238 854.919Z"
                      fill="#F7B3CE"
                    />
                    <path
                      d="M715.461 855.735L710.238 854.919L599.891 965.101L618.481 970.955L716.096 874.547L715.461 855.735Z"
                      fill="#F58F8E"
                    />
                    <path
                      d="M716.587 898.827L716.023 871.992L618.481 970.955L637.452 977.072L716.587 898.827Z"
                      fill="#FEE18A"
                    />
                    <path
                      d="M717.179 923.733L716.587 898.827L637.452 977.072L656.424 983.189L717.179 923.733Z"
                      fill="#F3F095"
                    />
                    <path
                      d="M717.964 943.483L717.179 923.733L656.424 983.189L659.658 984.305L717.964 943.483Z"
                      fill="#55C1AE"
                    />
                    <g clipPath="url(#clip0)">
                      <path
                        d="M662.066 939.068C662.546 939.784 662.847 940.528 662.97 941.298C663.188 942.661 662.81 943.901 661.834 945.019C660.918 946.127 659.748 946.789 658.324 947.003C657.374 947.146 656.447 947.043 655.54 946.694C654.624 946.286 653.843 945.584 653.198 944.589L645.952 933.485L614.625 938.2L611.191 950.912C610.887 952.05 610.363 952.948 609.617 953.606C608.863 954.205 607.981 954.581 606.972 954.733C605.608 954.938 604.286 954.652 603.007 953.873C601.728 953.095 600.979 952.025 600.761 950.662C600.638 949.892 600.693 949.095 600.925 948.271L617.054 891.874C617.398 890.609 618.057 889.6 619.03 888.847C620.053 888.025 621.187 887.521 622.433 887.333C623.679 887.146 624.888 887.297 626.061 887.788C627.283 888.211 628.256 888.975 628.979 890.079L662.066 939.068ZM640.614 925.187L624.642 900.561L617.118 928.724L640.614 925.187ZM681.911 943.635C677.371 944.5 674.836 943.274 674.305 939.956C674.077 938.534 674.292 937.41 674.95 936.583C675.538 935.705 676.624 935.087 678.207 934.727L681.027 934.121C683.44 933.636 685.156 932.589 686.175 930.98C687.193 929.37 687.47 927.114 687.005 924.211L680.647 884.486C680.372 882.768 680.658 881.33 681.506 880.171C682.403 878.944 683.712 878.201 685.433 877.942C687.212 877.674 688.692 877.997 689.871 878.912C691.101 879.758 691.853 881.04 692.128 882.758L698.485 922.483C700.278 933.68 695.693 940.529 684.731 943.028L681.911 943.635Z"
                        fill="#5E1286"
                      />
                    </g>
                    <path
                      d="M251.51 393.432C187.267 316.149 159.549 267.705 152.918 154.906L295.775 306.479L251.51 393.432Z"
                      fill="#824B2E"
                    />
                    <path
                      d="M271.63 183.89L152.918 154.906C181.467 214.379 278.169 320.259 292.757 311.231C307.345 302.203 392.858 201.946 392.858 201.946L271.63 183.89Z"
                      fill="#0A0A0A"
                    />
                    <path
                      d="M998.994 424.318C996.978 177.312 970.728 83.3859 876.258 0.480957C880.843 192.369 905.936 330.712 905.936 330.712C905.936 330.712 976.484 405.483 998.994 424.318Z"
                      fill="#824B2E"
                    />
                    <path
                      d="M251.006 395.808L292.254 311.231L389.336 200.52L404.93 192.918L419.014 183.415C419.014 183.415 424.548 175.812 419.014 175.812C413.481 175.812 407.445 177.713 407.445 177.713L392.354 181.514L377.264 186.266C377.264 186.266 374.749 187.216 373.743 186.266C372.737 185.316 373.743 181.514 373.743 181.514L375.755 178.188C375.755 178.188 380.282 174.387 383.3 172.961C386.318 171.536 434.105 154.906 446.177 151.58C458.25 148.253 471.831 147.778 486.922 147.303C502.012 146.828 518.612 147.303 519.618 147.303C520.624 147.303 520.624 145.402 520.624 145.402C520.624 145.402 520.624 144.452 519.618 143.502C518.612 142.552 475.352 142.552 474.346 142.076C473.34 141.601 469.819 141.126 469.819 141.126C469.819 141.126 463.783 140.176 463.28 139.701C462.777 139.226 461.771 136.375 463.28 134.474C464.789 132.573 467.807 133.049 468.813 131.623C469.819 130.198 476.861 128.772 476.861 128.772L579.98 131.623L618.21 139.701L664.99 155.381L710.765 177.713H724.849L759.558 160.607L800.302 127.347L837.022 71.7538C837.022 71.7538 871.731 0.48084 875.755 0.00568663C879.779 -0.469467 895.372 28.99 895.372 28.99L914.99 77.4557L928.069 166.784L932.093 238.533L936.62 351.619L1000 423.367V426.218H997.485L967.807 399.609L986.419 467.556L1000 535.028L989.94 545.006L939.135 577.792V580.168L955.735 576.366L967.807 574.466H982.898C989.94 574.466 982.898 586.82 982.898 586.82C982.898 586.82 787.529 779.682 737.425 809.191C687.321 838.701 605.713 853.059 520.121 873.812H494.97C458.281 870.267 438.328 865.974 403.924 853.856C338.538 822.484 300.263 796.432 229.88 738.869L193.159 692.779L167.505 652.866C156.338 632.916 154.93 624.832 155.433 622.456C155.936 620.08 164.99 610.102 176.057 590.621L193.159 559.736L251.006 395.808Z"
                      fill="black"
                    />
                    <path
                      d="M688.129 628.633C814.203 648.155 869.431 684.832 954.729 774.03C865.03 686.927 809.11 649.904 687.123 630.534L688.129 628.633Z"
                      fill="white"
                    />
                    <path
                      d="M653.232 658.568C755.608 678.09 800.455 714.767 869.719 803.965C796.881 716.861 751.472 679.839 652.415 660.468L653.232 658.568Z"
                      fill="white"
                    />
                    <path
                      d="M648.928 708.934C716.231 723.225 745.713 750.073 791.248 815.368C743.364 751.606 713.512 724.505 648.391 710.325L648.928 708.934Z"
                      fill="white"
                    />
                    <path
                      d="M768.612 465.655C768.612 404.361 686.117 341.456 626.257 354.47C562.877 368.249 526.008 454.574 527.666 498.441C527.502 548.232 560.865 570.374 626.257 572.565C697.183 574.941 768.612 526.95 768.612 465.655Z"
                      fill="#C9F180"
                    />
                    <path
                      d="M641.729 353.503C565.065 363.907 557.726 542.094 620.025 538.77C682.324 535.446 718.393 343.1 641.729 353.503Z"
                      fill="black"
                    />
                    <ellipse
                      cx="652.042"
                      cy="496.652"
                      rx="7.04225"
                      ry="6.65214"
                      fill="white"
                    />
                    <path
                      d="M349.598 372.051C304.829 372.051 270.624 437.622 279.175 505.569C285.717 542.818 308.914 562.545 349.598 556.885C421.962 536.249 414.158 372.051 349.598 372.051Z"
                      fill="#C9F180"
                    />
                    <path
                      d="M347.082 372.05C291.75 377.752 279.679 538.354 324.447 538.354C369.215 538.354 402.415 366.348 347.082 372.05Z"
                      fill="black"
                    />
                    <ellipse
                      cx="346.579"
                      cy="496.541"
                      rx="7.04225"
                      ry="6.65214"
                      fill="white"
                    />
                    <path
                      d="M266.6 607.251C140.526 626.773 85.2972 663.451 0 752.648C89.6983 665.545 145.619 628.522 267.606 609.152L266.6 607.251Z"
                      fill="white"
                    />
                    <path
                      d="M301.497 637.186C199.121 656.708 154.274 693.385 85.0098 782.583C157.847 695.479 203.256 658.457 302.314 639.087L301.497 637.186Z"
                      fill="white"
                    />
                    <path
                      d="M305.801 687.552C238.498 701.843 209.015 728.691 163.48 793.987C211.365 730.224 241.217 703.123 306.338 688.944L305.801 687.552Z"
                      fill="white"
                    />
                    <path
                      d="M425.819 722.617L431.813 658.722L424.798 658.134L418.804 722.03C402.36 742.755 383.178 741.23 332.445 716.71C331.08 716.091 330.575 719.073 332.445 720.661C334.316 722.249 350.001 730.277 368.255 737.265C386.51 744.252 399.946 740.333 399.946 740.333C399.946 740.333 417.961 731.022 419.642 729.255C421.322 727.488 423.828 727.697 425.153 729.716C426.479 731.735 439.181 741.615 444.211 743.017C449.241 744.419 470.453 747.241 478.416 746.319C486.379 745.397 508.43 740.979 515.343 737.265C522.256 733.55 524.08 728.189 515.832 732.059C507.583 735.928 441.964 753.539 425.819 722.617Z"
                      fill="white"
                    />
                    <path
                      d="M466.307 608.241C454.243 607.819 431.12 619.848 425.628 618.704C420.136 617.561 398.726 598.744 392.414 605.655C386.103 612.567 395.207 624.297 395.207 624.297C415.22 653.05 411.631 648.524 424.045 659.065L433.093 659.381C433.093 659.381 469.323 634.022 474.629 627.076C479.935 620.129 478.371 608.663 466.307 608.241Z"
                      fill="#FFCDCF"
                    />
                    <defs>
                      <clipPath id="clip0">
                        <rect
                          width="101"
                          height="72"
                          fill="white"
                          transform="translate(595.261 883.51) rotate(-4.11931)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <ActiveLink activeClassName="bg-ccd-primary-900" href="/courses">
                <a className="px-3 py-2 rounded-md text-sm font-medium text-white ">
                  Courses
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName="bg-ccd-primary-900"
                href="/tutorials"
              >
                <a className="px-3 py-2 rounded-md text-sm font-medium text-white ">
                  Tutorials
                </a>
              </ActiveLink>
              <ActiveLink activeClassName="bg-ccd-primary-900" href="/blog">
                <a className="px-3 py-2 rounded-md text-sm font-medium text-white ">
                  Blog
                </a>
              </ActiveLink>
              <ActiveLink activeClassName="bg-ccd-primary-900" href="/podcasts">
                <a className="px-3 py-2 rounded-md text-sm font-medium text-white ">
                  Podcasts
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName="bg-ccd-primary-900"
                href="/community"
              >
                <a className="px-3 py-2 rounded-md text-sm font-medium text-white ">
                  Community
                </a>
              </ActiveLink>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ccd-secondary-500 hover:bg-ccd-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-ccd-secondary-500"
              >
                <span>Go Pro</span>
              </button>
            </div>
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <button className="bg-ccd-primary-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                {/* Heroicon name: bell --> */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Profile dropdown --> */}
              <OutsideClick toggle={setUserMenu} value={false}>
                <div className="ml-3 relative">
                  <div>
                    <button
                      className="bg-ccd-primary-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-white"
                      id="user-menu"
                      aria-haspopup="true"
                      onClick={() => setUserMenu(!userMenu)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </button>
                  </div>
                  {/*
                  Profile dropdown panel, show/hide based on dropdown state.
    
                  Entering: "transition ease-out duration-200"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                  Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95"
                --> */}
                  <Transition
                    show={userMenu}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-40"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-ccd-primary-100"
                        role="menuitem"
                      >
                        Your Profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-ccd-primary-100"
                        role="menuitem"
                      >
                        Settings
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-ccd-primary-100"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </div>
                  </Transition>
                </div>
              </OutsideClick>
            </div>
          </div>
        </div>
      </div>

      {/*
        Mobile menu, toggle classNamees based on menu state.
    
        Menu open: "block", Menu closed: "hidden"
      --> */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-ccd-primary-500"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-ccd-primary-700"
          >
            Team
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-ccd-primary-700"
          >
            Projects
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-ccd-primary-700"
          >
            Calendar
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5 sm:px-6">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">Tom Cook</div>
              <div className="text-sm font-medium text-gray-400">
                tom@example.com
              </div>
            </div>
            <button className="ml-auto flex-shrink-0 bg-ccd-primary-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-white">
              <span className="sr-only">View notifications</span>
              {/* Heroicon name: bell --> */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
          <div className="mt-3 px-2 sm:px-3">
            <a
              href="#"
              className="block px-3 py-2 rounded-md space-y-1 text-base font-medium text-gray-400 hover:text-white hover:bg-ccd-primary-700"
            >
              Your Profile
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-ccd-primary-700"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-ccd-primary-700"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
