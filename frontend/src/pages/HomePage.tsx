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
  const headerHeight = 62;
  const contentTopOffset = headerHeight;
  const heroHeight = 126;
  const heroGradient =
    'linear-gradient(180deg,#e5392c 0%,#e5392c 54px,#e94734 92px,#f5f5f7 100%)';

  return (
    <PhoneShell>
      <div className="relative h-[100svh] overflow-hidden bg-[#f5f5f7] md:min-h-[844px] md:max-h-[932px] md:rounded-[34px]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-[#e5392c]"
          style={{ height: `calc(${headerHeight}px + env(safe-area-inset-top))` }}
        />
        <div className="absolute inset-x-0 top-0 z-30">
          <HomeHeader store={config.store} />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 z-0 bg-[#e5392c]"
          style={{
            top: `${headerHeight - 4}px`,
            height: pullDistance > 0 ? `${pullDistance + 28}px` : 0,
            transition: pullTransition
          }}
        />
        <RefreshIndicator status={pull.status} pullDistance={pull.pullDistance} />
        <div
          className="absolute inset-x-0 bottom-0 top-0 z-10 bg-transparent"
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
                  className="pointer-events-none absolute inset-x-0 top-0 z-0"
                  style={{
                    height: `${heroHeight + pullDistance}px`,
                    background: heroGradient,
                    transition: pullTransition
                  }}
                />
                <div
                  className="relative z-10"
                  style={{
                    paddingTop:
                      pull.status === 'refreshing' || pull.status === 'success' ? `calc(${contentTopOffset}px + 0.9rem)` : `${contentTopOffset}px`,
                    transition: 'padding-top 180ms ease'
                  }}
                >
                  <StatsCard stats={config.stats} />
                </div>
                <div className="relative z-10 pb-32 pt-[6px]">
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
