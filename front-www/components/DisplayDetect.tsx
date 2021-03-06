import React, { useState, useEffect } from 'react';
import getUiStore from 'redux-getters/getUiReducer';
import { setViewWidth, setViewHeight, setMobile } from 'store/ui/action';
import { useDispatch } from 'react-redux';
import _debounce from 'lodash/debounce';
import { useIsMounted, checkClient } from 'lib';
import Logger from 'lib/logger';
import { isMobile } from 'react-device-detect';

const logger = new Logger('components/DisplayDetect.tsx');

const DisplayDetect: React.FunctionComponent<unknown> = () => {
  const ui = getUiStore();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const isClient = checkClient();

  const [onResizeDebounced] = useState(() =>
    _debounce<() => void>(
      function () {
        const width =
          window.innerWidth || document.documentElement.clientWidth || 0;
        const height =
          window.innerHeight || document.documentElement.clientHeight || 0;
        logger.log('display changed', { width, height });
        if (ui.viewWidth !== width) dispatch(setViewWidth(width));
        if (ui.viewHeight !== height) dispatch(setViewHeight(height));
        if (ui.isMobile !== isMobile) dispatch(setMobile(isMobile));
        logger.log(isMobile);
      },
      400,
      { trailing: true }
    )
  );

  if (isMounted && isClient) {
    window.addEventListener('resize', onResizeDebounced);
    useEffect(() => {
      onResizeDebounced();
    }, []);
  }

  return (
    <div className="display_detect" style={{ display: 'none' }}>
      &nbsp;
    </div>
  );
};

export default DisplayDetect;
