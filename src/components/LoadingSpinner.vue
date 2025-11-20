<template>
  <div class="wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" aria-label="Loading...">
      <circle />
    </svg>
  </div>
</template>

<style scoped>
.wrapper {
  --spinner-size: 4rem;
  --stroke-width: 6px;

  display: grid;
  place-items: center;
  padding-block: 4rem;

  &.small {
    --spinner-size: 1.25rem;
    --stroke-width: 2px;
    padding: 0.125rem;
  }
}

svg {
  display: block;
  width: var(--spinner-size);
  aspect-ratio: 1;

  --radius: calc(50% - var(--stroke-width) / 2);
  --circumference: calc(2 * 3.1415926536 * var(--radius));
  --max-gap: calc(var(--circumference));
  --min-gap: calc(var(--circumference) * 0.25);
}

circle {
  cx: 50%;
  cy: 50%;
  r: var(--radius);

  fill: transparent;
  stroke-dasharray: var(--circumference);
  stroke: currentColor;
  stroke-width: var(--stroke-width);
  stroke-linecap: round;
  transform-origin: center;

  animation:
    stroke-rotate calc(1.333s * 4) cubic-bezier(0.35, 0, 0.25, 1) infinite both,
    spin 1.33s infinite linear;
}

@keyframes spin {
  from {
    rotate: 0;
  }

  to {
    rotate: 1turn;
  }
}

@keyframes stroke-rotate {
  0% {
    stroke-dashoffset: var(--max-gap);
  }
  12.5% {
    stroke-dashoffset: var(--min-gap);
    transform: rotate(0);
  }
  12.5001%,
  25% {
    transform: rotateX(180deg) rotate(90deg);
  }
  25% {
    stroke-dashoffset: var(--max-gap);
  }
  25.0001%,
  37.5% {
    transform: rotate(270deg);
  }
  37.5% {
    stroke-dashoffset: var(--min-gap);
  }
  37.5001%,
  50% {
    transform: rotateX(180deg) rotate(180deg);
  }
  50% {
    stroke-dashoffset: var(--max-gap);
  }
  50.0001%,
  62.5% {
    transform: rotate(180deg);
  }
  62.5% {
    stroke-dashoffset: var(--min-gap);
  }
  62.5001%,
  75% {
    transform: rotateX(180deg) rotate(270deg);
  }
  75% {
    stroke-dashoffset: var(--max-gap);
  }
  75.0001%,
  87.5% {
    transform: rotate(90deg);
  }
  87.5% {
    stroke-dashoffset: var(--min-gap);
  }
  87.5001%,
  100% {
    transform: rotateX(180deg) rotate(360deg);
  }
  100% {
    stroke-dashoffset: var(--max-gap);
  }
}
</style>
