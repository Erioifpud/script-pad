import { memo, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Component1Icon, UpdateIcon } from '@radix-ui/react-icons';
import { indicatorEventBus } from '@/event';

const IndicatorButton = memo(() => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    indicatorEventBus.on('loading', setLoading)
    return () => {
      indicatorEventBus.off('loading', setLoading)
    }
  }, [])

  return (
    <Button variant="outline" size="icon" aria-label="Home">
      <Link href="/">
        {loading && (
          <UpdateIcon className="animate-spin" />
        )}
        {!loading && (
          <Component1Icon />
        )}
      </Link>
    </Button>
  )
})

IndicatorButton.displayName = 'IndicatorButton';

export default IndicatorButton;