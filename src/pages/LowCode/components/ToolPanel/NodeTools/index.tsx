import { memo } from 'react';

const NodeTools = memo(() => {
  return (
    <div className="node-tools">
      <div className="node-tools-item">
        <i className="iconfont icon-copy"></i>
      </div>
      <div className="node-tools-item">
        <i className="iconfont icon-delete"></i>
      </div>
    </div>
  );
});

export default NodeTools;
