import React from "react";

const Header = () => {
  return (
    <div className="my-[12px] border-b  flex items-center justify-between  w-full border-white/10">
      <div className="text-[24px] opacity-80 py-[12px]">
        <a href="https://github.com/chiragbadhe/github-society">
          <span className="text-cyan-600">#</span>github-society
        </a>
      </div>
      <div className="flex space-x-2">
        <a
          href="https://github.com/chiragbadhe/github-society"
          className="text-white/40"
          target="_blank"
        >
          <div className="px-[12px] py-[3px] duration-300 hover:bg-white/20 flex space-x-[6px] items-center justify-center border border-white/10">
            <img src="/star.svg" className="h-[16px] w-[16px]" alt="" />
            <span>Star</span>
          </div>
        </a>

        <a
          href="https://x.com/0xChirag"
          className="text-white/40"
          target="_blank"
        >
          <div className="px-[12px] py-[3px] duration-300 hover:bg-white/20 flex space-x-[6px] items-center justify-center border border-white/10">
            <img src="/follow.svg" className="h-[16px] w-[16px]" alt="" />
            <span>Follow</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Header;
