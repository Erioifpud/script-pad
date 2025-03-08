import { memo, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ComponentIcon, RefreshCwIcon } from 'lucide-react'
import { eventBus } from '@/event';
import { router } from '@/router';

const IndicatorButton = memo(() => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cancelIndicatorLoadingSub = eventBus.subscribe('indicator-loading', (event) => {
      setLoading(event.loading);
    })

    return () => {
      cancelIndicatorLoadingSub && cancelIndicatorLoadingSub()
    }
  }, [])

  return (
    <Button variant="outline" size="icon" aria-label="Home">
      <a onClick={() => router.navigate('/')}>
        {loading && (
          <RefreshCwIcon className="animate-spin" />
        )}
        {!loading && (
          <ComponentIcon />
        )}
      </a>
    </Button>
  )
})

IndicatorButton.displayName = 'IndicatorButton';

export default IndicatorButton;