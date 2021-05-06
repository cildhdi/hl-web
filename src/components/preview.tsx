import React from 'react';

export const Preview = () => {
  return (
    <div className="relative h-full">
      <iframe
        title="leap preview"
        src="/threejs-bones.html"
        className="w-full h-full"
      />
      <div className="absolute flex items-center justify-center top-0 left-0 bottom-0 right-0" />
    </div>
  );
};
