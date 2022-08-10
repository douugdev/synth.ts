import React from "react";
import dynamic from "next/dynamic";

const NoSSRWrapper: React.FC<{ children: React.ReactNode }> = (props) => (
  <>{props.children}</>
);
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
