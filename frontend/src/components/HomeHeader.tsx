import { Search } from 'lucide-react';
import type { StoreConfig } from '../types/config';
import { getPlaceholder } from '../lib/helpers';

export function HomeHeader({ store }: { store: StoreConfig }) {
  return (
    <header className="px-[14px] text-white">
      <div className="safe-top relative flex items-center justify-between pb-1 pt-1">
        <div className="flex items-center gap-2">
          <img
            src={store.avatar || getPlaceholder('店铺', '#220f0c')}
            alt={store.name}
            className="h-[36px] w-[36px] rounded-[3px] object-cover shadow-[0_5px_12px_rgba(0,0,0,0.16)]"
          />
          <div className="translate-y-[9px]">
            <div className="flex items-center gap-[2px]">
              <h1 className="max-w-[168px] truncate text-[16px] font-normal leading-none tracking-[-0.01em] text-white/95">
                {store.name}
              </h1>
              <img
                src="/extracted_icons/hidden_icon_transparent.svg"
                alt=""
                className="h-[15px] w-[28px] object-contain"
                style={{ transform: 'scaleX(1.18)' }}
              />
              <img src="/extracted_icons/下_拉_.svg" alt="" className="h-[10px] w-[14px] object-contain" />
            </div>
            <div className="mt-0.5 inline-flex max-w-[168px] items-center rounded-full bg-white px-2 py-[2px] text-[10px] font-medium leading-none text-[#bf5a43] shadow-[0_3px_8px_rgba(153,46,30,0.1)]">
              <span className="truncate">{store.notice}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pr-[2px]">
          {store.showSearch && (
            <button className="flex flex-col items-center gap-0.5 text-white">
              <Search size={20} strokeWidth={2.1} />
              <span className="text-[10px] leading-none text-white/95">搜索</span>
            </button>
          )}
          {store.showScan && (
            <button className="flex flex-col items-center gap-0.5 text-white">
              <img
                src="/扫一扫.svg"
                alt="扫一扫"
                className="h-5 w-5 object-contain brightness-0 invert"
              />
              <span className="text-[10px] leading-none text-white/95">扫码</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
