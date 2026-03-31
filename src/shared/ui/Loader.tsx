"use client";

import React from "react";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <span className={`loader ${className}`} />
  );
}

<style jsx global>{`
  .loader {
    display: inline-flex;
    width: 1em;
    height: 1em;
    aspect-ratio: 1;
    -webkit-mask: conic-gradient(from 15deg, #0000, #000);
    animation: l26 1s infinite steps(12);
  }

  .loader,
  .loader:before,
  .loader:after {
    background:
      radial-gradient(closest-side at 50% 12.5%, #ffffff 96%, #0000) 50% 0/20% 80% repeat-y,
      radial-gradient(closest-side at 12.5% 50%, #ffffff 96%, #0000) 0 50%/80% 20% repeat-x;
  }

  .loader:before,
  .loader:after {
    content: "";
    grid-area: 1/1;
    transform: rotate(30deg);
  }

  .loader:after {
    transform: rotate(60deg);
  }

  @keyframes l26 {
    100% {
      transform: rotate(1turn);
    }
  }
`}</style>
