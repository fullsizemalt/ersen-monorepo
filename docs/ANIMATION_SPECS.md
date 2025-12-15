# Animation & Polish Specifications

## Skeleton Loading States

### Widget Skeleton Components

All widgets should show skeleton loaders while data is fetching:

```tsx
export const TaskSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-4 h-4 bg-white/10 rounded"></div>
        <div className="flex-1 h-4 bg-white/10 rounded" style={{ width: `${60 + Math.random() * 30}%` }}></div>
      </div>
    ))}
  </div>
);

export const KanbanSkeleton = () => (
  <div className="flex gap-3">
    {[1, 2, 3].map(col => (
      <div key={col} className="flex-1 space-y-2">
        <div className="h-6 bg-white/10 rounded mb-3 w-24 animate-pulse"></div>
        {[1, 2, 3].map(card => (
          <div key={card} className="h-20 bg-white/10 rounded animate-pulse"></div>
        ))}
      </div>
    ))}
  </div>
);

export const HeatmapSkeleton = () => (
  <div className="grid grid-cols-7 gap-1">
    {Array.from({ length: 35 }).map((_, i) => (
      <div key={i} className="aspect-square bg-white/10 rounded animate-pulse"></div>
    ))}
  </div>
);
```

### Shimmer Effect

Premium shimmer animation using CSS gradients:

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

## Scroll Animations

### Intersection Observer Hook

```tsx
import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
```

### Widget Entry Animations

```tsx
export const TaskWidget = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Widget content */}
    </div>
  );
};
```

### Stagger Animation

Widgets appear in sequence with 100ms delay between each:

```tsx
export const WidgetGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {widgets.map((widget, index) => (
        <div
          key={widget.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'backwards'
          }}
        >
          <Widget {...widget} />
        </div>
      ))}
    </div>
  );
};
```

---

## SVG Icon Animations

### Micro-interactions

All icons animate on hover/click:

```tsx
// Checkbox animation
<svg className="w-4 h-4 transition-all duration-200 group-hover:scale-110">
  <path className="transition-all duration-200 group-hover:stroke-blue-400" />
</svg>

// Plus icon rotation
<Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />

// More menu bounce
<MoreHorizontal className="w-4 h-4 transition-transform duration-200 group-hover:scale-125" />
```

### Loading Spinners

```tsx
export const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
```

### Success/Error States

```tsx
// Success checkmark draw-in
<svg className="w-12 h-12" viewBox="0 0 48 48">
  <circle
    cx="24"
    cy="24"
    r="22"
    fill="none"
    stroke="#10B981"
    strokeWidth="2"
    className="animate-[draw-circle_0.5s_ease-out_forwards]"
  />
  <path
    d="M14 24l6 6 14-14"
    fill="none"
    stroke="#10B981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-[draw-check_0.4s_0.2s_ease-out_forwards]"
    strokeDasharray="24"
    strokeDashoffset="24"
  />
</svg>

@keyframes draw-circle {
  to {
    strokeDashoffset: 0;
  }
}

@keyframes draw-check {
  to {
    strokeDashoffset: 0;
  }
}
```

---

## Card Animations

### Hover Effects

```css
.widget-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

.widget-card:active {
  transform: translateY(-2px) scale(1.01);
}
```

### Card Flip (for config mode)

```tsx
const [isFlipped, setIsFlipped] = useState(false);

<div className="relative w-full h-full" style={{ perspective: '1000px' }}>
  <div
    className={`absolute inset-0 transition-transform duration-500 ${
      isFlipped ? 'rotate-y-180' : ''
    }`}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {/* Front */}
    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
      <WidgetContent />
    </div>
    
    {/* Back */}
    <div className="absolute inset-0 rotate-y-180" style={{ backfaceVisibility: 'hidden' }}>
      <WidgetSettings />
    </div>
  </div>
</div>
```

---

## Data Transitions

### Count-up Animation

```tsx
import { useSpring, animated } from 'react-spring';

export const AnimatedNumber = ({ value }: { value: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return <animated.span>{number.to(n => n.toFixed(0))}</animated.span>;
};
```

### Progress Bars

```tsx
export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${progress}%`,
          transform: `scaleX(${progress / 100})`,
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};
```

---

## List Animations

### Framer Motion List

```tsx
import { motion, AnimatePresence } from 'framer-motion';

export const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <AnimatePresence mode="popLayout">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{
            layout: { type: 'spring', stiffness: 350, damping: 25 },
            opacity: { duration: 0.2 },
            y: { duration: 0.3, delay: index * 0.05 }
          }}
        >
          <TaskCard task={task} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
```

---

## Page Transitions

### Route Change Animation

```tsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

export const Page = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);
```

---

## Performance Optimizations

### GPU Acceleration

```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU acceleration */
}
```

### Reduced Motion

Respect user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const duration = prefersReducedMotion ? 0 : 500;
```

---

## Implementation Checklist

### Phase 1 - Foundation
- [ ] Create skeleton components for each widget type
- [ ] Add shimmer animation CSS
- [ ] Implement `useScrollAnimation` hook
- [ ] Add Framer Motion or react-spring dependency

### Phase 2 - Widget Polish
- [ ] Add loading states to all widgets
- [ ] Implement scroll-triggered entry animations
- [ ] Add hover micro-interactions to all icons
- [ ] Implement stagger animation for widget grid

### Phase 3 - Advanced
- [ ] Card flip for widget settings
- [ ] Animated count-up for stats
- [ ] List reordering with drag animations
- [ ] Success/error state SVG animations
- [ ] Page transition animations

### Phase 4 - Optimization
- [ ] GPU acceleration for animations
- [ ] Reduced motion support
- [ ] Performance testing (60fps target)
- [ ] Animation documentation

---

**Created**: 2025-11-29  
**Status**: Specification Complete
