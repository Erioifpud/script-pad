import { memo, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Component1Icon, UpdateIcon } from '@radix-ui/react-icons';
import { eventBus } from '@/event';

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
      <a href="/">
        {loading && (
          <UpdateIcon className="animate-spin" />
        )}
        {!loading && (
          <Component1Icon />
        )}
      </a>
    </Button>
  )
})

IndicatorButton.displayName = 'IndicatorButton';

export default IndicatorButton;