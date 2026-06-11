import { useEffect, useRef } from 'react';
import { BottomNav } from '../components/BottomNav';
import { ChipGrid } from '../components/ChipGrid';
import { ErrorState } from '../components/ErrorState';
import { HomeHeader } from '../components/HomeHeader';
import { ImproveCard } from '../components/ImproveCard';
import { LoadingState } from '../components/LoadingState';
import { MenuGrid } from '../components/MenuGrid';
import { PhoneShell } from '../components/PhoneShell';
import { RefreshIndicator } from '../components/RefreshIndicator';
import { StatsCard } from '../components/StatsCard';
import { WorkOrderCard } from '../components/WorkOrderCard';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { useConfigStore } from '../store/configStore';

export function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { config, error, loading, fetchRemote } = useConfigStore();

  useEffect(() => {
    void fetchRemote();
  }, [fetchRemote]);

  const pull = usePullToRefresh(scrollRef, async () => {
    await fetchRemote('refresh');
  });

  const pullDistance = Math.max(0, pull.pullDistance);
  const pullTransition = pull.status === 'pulling' || pull.status === 'ready' ? 'none' : 'all 220ms ease';

  return (
    <PhoneShell>
      <div className="relative h-[100svh] overflow-hidden bg-[#f5f5f7] md:min-h-[844px] md:max-h-[932px] md:rounded-[34px]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 bg-[linear-gradient(180deg,#e5392c_0%,#e5392c_68%,#eb5a45_82%,rgba(245,245,247,0.08)_100%)]"
          style={{
            height: `calc(190px + env(safe-area-inset-top) + ${pullDistance}px)`,
            transform: `translateY(${pullDistance * 0.12}px)`,
            transition: pullTransition
          }}
        />
        <HomeHeader store={config.store} />
        <RefreshIndicator status={pull.status} pullDistance={pull.pullDistance} />
        <div
          className="absolute inset-x-0 bottom-0 top-[66px] z-10 bg-transparent"
          style={{
            transform: `translateY(${pull.pullDistance}px)`,
            transition: pull.status === 'pulling' || pull.status === 'ready' ? 'none' : 'transform 220ms ease'
          }}
        >
          <div
            ref={scrollRef}
            className="hide-scrollbar relative h-full overflow-y-auto overscroll-contain"
            style={{
              WebkitOverflowScrolling: 'touch',
              userSelect: 'none',
              overscrollBehaviorY: 'contain'
            }}
            {...pull.bind}
          >
            {loading ? (
              <LoadingState text="首页配置加载中..." />
            ) : error ? (
              <ErrorState message={error} onRetry={() => void fetchRemote()} />
            ) : (
              <>
                <div
                  style={{
                    paddingTop: pull.status === 'refreshing' || pull.status === 'success' ? '0.9rem' : '0rem',
                    transition: 'padding-top 180ms ease'
                  }}
                >
                  <StatsCard stats={config.stats} />
                </div>
                <div className="pb-32 pt-[6px]">
                  <MenuGrid menus={config.menus} />
                  <ChipGrid chips={config.chips} />
                  <WorkOrderCard config={config.workOrder} />
                  <ImproveCard config={config.improveCard} />
                </div>
              </>
            )}
          </div>
        </div>
        <BottomNav items={config.bottomNav} />
      </div>
    </PhoneShell>
  );
}
